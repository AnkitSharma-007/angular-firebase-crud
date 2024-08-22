import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { SnackbarService } from '../../services/snackbar.service';
import { EmployeeForm } from '../../models/employee-form';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    AsyncPipe,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly snackbarService = inject(SnackbarService);
  private destroyed$ = new ReplaySubject<void>(1);

  protected employeeForm: FormGroup<EmployeeForm> =
    this.nonNullableFormBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
    });
  protected formTitle = 'Add';
  protected submitted = false;
  protected employeeId!: string;
  protected cityList$ = this.employeeService.getCityList();

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params: Params) => {
          this.employeeId = params['get']('id');
          if (this.employeeId) {
            this.formTitle = 'Edit';
            return this.employeeService.getEmployeeById(this.employeeId);
          } else {
            return EMPTY;
          }
        })
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        if (response) {
          this.employeeForm.controls.name.setValue(response['name']);
          this.employeeForm.controls.gender.setValue(response['gender']);
          this.employeeForm.controls.department.setValue(
            response['department']
          );
          this.employeeForm.controls.city.setValue(response['city']);
        }
      });
  }

  save() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return;
    }

    if (this.employeeId) {
      this.employeeService
        .updateEmployee(this.employeeId, this.employeeForm.getRawValue())
        .then(
          () => {
            this.employeeService.getAllEmployees();
            this.snackbarService.showSnackBar(
              'Employee data updated successfully.'
            );
            this.navigateToHome();
          },
          () => {
            console.error('Failed to update employee.');
          }
        );
    } else {
      this.employeeService.saveEmployee(this.employeeForm.getRawValue()).then(
        () => {
          this.employeeService.getAllEmployees();
          this.snackbarService.showSnackBar(
            'Employee data added successfully.'
          );
          this.navigateToHome();
        },
        () => {
          console.error('Failed to add employee.');
        }
      );
    }
  }

  get employeeFormControl() {
    return this.employeeForm.controls;
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
