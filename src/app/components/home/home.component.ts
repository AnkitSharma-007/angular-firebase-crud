import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/models/appuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public employeeList: Employee[];
  appUser: AppUser;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService) {
    authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (data: Employee[]) => this.employeeList = data
    );
  }

  delete(employeeID) {
    if (confirm('Are you sure you want to delete this employee record ??')) {
      this.employeeService.deleteEmployee(employeeID).then(() => {
        this.getEmployees();
      }, error => console.error(error));
    }
  }
}
