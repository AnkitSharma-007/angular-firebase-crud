import { Component, OnDestroy, OnInit } from "@angular/core";
import { City } from "src/models/city";
import { Employee } from "src/models/employee";
import { EmployeeService } from "src/app/services/employee.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EMPTY, ReplaySubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-employeeform",
  templateUrl: "./employeeform.component.html",
  styleUrls: ["./employeeform.component.scss"],
})
export class EmployeeformComponent implements OnInit, OnDestroy {
  title = "Create";
  employeeId: string;
  employee = new Employee();
  private destroyed$ = new ReplaySubject<void>(1);
  cityList$: Observable<City[]>;

  constructor(
    private readonly avRoute: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly router: Router
  ) {
    this.cityList$ = this.employeeService.getCityList();
  }

  ngOnInit() {
    this.avRoute.paramMap
      .pipe(
        switchMap((params: Params) => {
          this.employeeId = params.get("id");
          if (this.employeeId) {
            this.title = "Edit";
            return this.employeeService.getEmployeeById(this.employeeId);
          } else {
            return EMPTY;
          }
        })
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: Employee) => {
        if (response) {
          this.employee = response;
        }
      });
  }

  onEmployeeFormSubmit() {
    if (this.employeeId) {
      this.employeeService
        .updateEmployee(this.employeeId, this.employee)
        .then(() => {
          this.navigateToHome();
        });
    } else {
      this.employeeService.saveEmployee(this.employee).then(() => {
        this.navigateToHome();
      });
    }
  }

  navigateToHome() {
    this.router.navigate(["/"]);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
