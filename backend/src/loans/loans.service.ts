import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoansService {
  private loans: any[] = [];

  constructor() {
    this.loadLoansData();
  }

  private loadLoansData(): void {
    try {
      const filePath = path.join(__dirname, '../../../data/loans.json');
      const data = fs.readFileSync(filePath, 'utf8');
      this.loans = JSON.parse(data);
    } catch (err) {
      this.loans = [];
    }
  }

  private saveLoansData(): void {
    try {
      const filePath = path.join(__dirname, '../../../data/loans.json');
      fs.writeFileSync(filePath, JSON.stringify(this.loans, null, 2), 'utf8');
    } catch (err) {
      throw new InternalServerErrorException('Error saving data');
    }
  }

  getAll() {
    return this.loans;
  }

  getByStatus(status: 'pending' | 'active') {
    return this.loans.filter((loan) => loan.status === status);
  }

  getByEmail(email: string) {
    return this.loans.filter((loan) => loan.applicant.email === email);
  }

  getExpired() {
    const now = new Date();
    return this.loans.filter((loan) => new Date(loan.maturityDate) < now);
  }

  remove(id: string, role: string) {
    if (role !== 'superAdmin') {
      throw new ForbiddenException('Not allowed');
    }

    const index = this.loans.findIndex((loan) => loan.id === id);
    if (index === -1) {
      throw new NotFoundException('Loan not found');
    }

    this.loans.splice(index, 1);
    this.saveLoansData();

    return { message: 'Deleted' };
  }
}