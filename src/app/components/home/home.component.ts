import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Employee } from '../../models/employee';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private paginator!: MatPaginator;
  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  private readonly employeeService = inject(EmployeeService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private destroyed$ = new ReplaySubject<void>(1);

  protected displayedColumns: string[] = [
    'name',
    'gender',
    'department',
    'city',
    'operation',
  ];
  protected dataSource: MatTableDataSource<Employee> = new MatTableDataSource();
  protected readonly appUser$ = this.authService.appUser$;
  protected loading = false;

  ngOnInit(): void {
    this.getEmployeeData();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteConfirm(rowData: Employee) {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      data: rowData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.getEmployeeData();
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          this.snackbarService.showSnackBar(
            'Employee data deleted successfully.'
          );
        },
        error: (error) => {
          this.snackbarService.showSnackBar('Unable to delete employee data.');
          console.error('Error ocurred while deleting employee data : ', error);
        },
      });
  }

  private async getEmployeeData() {
    this.loading = true;
    const employees = await this.employeeService.getAllEmployees();
    this.dataSource.data = employees as Employee[];
    this.loading = false;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
