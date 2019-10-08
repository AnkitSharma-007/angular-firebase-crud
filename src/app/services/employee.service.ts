import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Employee } from 'src/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private db: AngularFirestore) { }

  // Get the list of all cities from the City collection in firestore DB
  getCityList(): Observable<any> {
    const cityList = this.db.collection('City').snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
            cityId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      }));
    return cityList;
  }

  // Add a new employee record into the Employee collection in firestore DB
  saveEmployee(employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.db.collection('Employee').add(employeeData);
  }

  // Get the list of all employeee record from the Employee collection
  getAllEmployees(): Observable<any> {
    const employeeList = this.db.collection('Employee').snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
            employeeId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      }));
    return employeeList;
  }

  // Get the record of particular employee based on the employeeid
  getEmployeeById(employeeId: string) {
    const employeeData = this.db.doc('Employee/' + employeeId).valueChanges();
    return employeeData;
  }

  // Update the record of an employee in the Employee collection in firestore DB
  updateEmployee(employeeId: string, employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.db.doc('Employee/' + employeeId).update(employeeData);
  }

  // Delete the employeee record from the Employee collection in firestore DB
  deleteEmployee(employeeId: string) {
    return this.db.doc('Employee/' + employeeId).delete();
  }
}
