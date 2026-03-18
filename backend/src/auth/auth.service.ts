import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';

interface Staff {
  id: number;
  name: string;
  email: string;
  role: 'staff' | 'admin' | 'superAdmin';
  password: string;
}

@Injectable()
export class AuthService {
  private staffs: Staff[] = [];

  constructor(private jwtService: JwtService) {
    this.loadStaffData();
  }

  private loadStaffData(): void {
    try {
      const filePath = path.join(__dirname, '../../../data/staffs.json');
      const data = fs.readFileSync(filePath, 'utf8');
      this.staffs = JSON.parse(data);
    } catch (err) {
      this.staffs = [];
    }
  }

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const user = this.staffs.find(
      (s) => s.email === email && s.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
