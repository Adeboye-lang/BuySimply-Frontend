import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Get('loans')
  getAll(@Request() req: any, @Query('status') status?: 'pending' | 'active') {
    const loans = status
      ? this.loansService.getByStatus(status)
      : this.loansService.getAll();

    return this.filterByRole(loans, req.user.role);
  }

  @Get('loans/expired')
  getExpired(@Request() req: any) {
    const loans = this.loansService.getExpired();
    return this.filterByRole(loans, req.user.role);
  }

  @Get('loans/:userEmail/get')
  getByUser(@Param('userEmail') email: string, @Request() req: any) {
    const loans = this.loansService.getByEmail(email);
    return { loans: this.filterByRole(loans, req.user.role) };
  }

  @Roles('superAdmin')
  @Delete('loan/:loanId/delete')
  delete(@Param('loanId') id: string, @Request() req: any) {
    return this.loansService.remove(id, req.user.role);
  }

  private filterByRole(loans: any[], role: string): any[] {
    if (role === 'staff') {
      return loans.map((loan) => ({
        ...loan,
        applicant: {
          name: loan.applicant.name,
          email: loan.applicant.email,
          telephone: loan.applicant.telephone,
        },
      }));
    }
    return loans;
  }
}
