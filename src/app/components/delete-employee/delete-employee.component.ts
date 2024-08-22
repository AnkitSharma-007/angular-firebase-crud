import { Component, Inject } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-employee',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-employee.component.html',
  styleUrl: './delete-employee.component.scss',
})
export class DeleteEmployeeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeData: Employee,
    private readonly employeeService: EmployeeService
  ) {}

  confirmDelete(): void {
    this.employeeService.deleteEmployee(this.employeeData.employeeId);
  }
}
