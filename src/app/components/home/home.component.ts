import { Component } from "@angular/core";
import { EmployeeService } from "src/app/services/employee.service";
import { AuthService } from "src/app/services/auth.service";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  // Added the following two variables for better readability
  private readonly employee$ = this.employeeService.getAllEmployees();
  private readonly appUser$ = this.authService.appUser$;

  employeeData$ = combineLatest([this.employee$, this.appUser$]).pipe(
    map(([employees, appUser]) => ({
      employeeList: employees,
      appUser,
    }))
  );

  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService
  ) {}

  delete(employeeID) {
    if (confirm("Are you sure you want to delete this employee record ?")) {
      this.employeeService.deleteEmployee(employeeID);
    }
  }
}
