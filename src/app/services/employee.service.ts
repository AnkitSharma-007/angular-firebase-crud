import { Injectable } from "@angular/core";
import { Employee } from "src/models/employee";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { City } from "src/models/city";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private afs: AngularFirestore) {}

  /**
   * Get the list of all cities from the City collection in firestore DB
   * @returns Observable<City[]>
   */
  getCityList(): Observable<City[]> {
    const cityList = this.afs
      .collection<City>("City")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((c) => ({
            cityId: c.payload.doc.id,
            ...c.payload.doc.data(),
          }));
        })
      );
    return cityList;
  }

  /**
   * Add a new employee record into the Employee collection in firestore DB
   * @param employee
   */
  saveEmployee(employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.afs.collection("Employee").add(employeeData);
  }

  /**
   * Get the list of all employee record from the Employee collection
   * @returns Observable<Employee[]>
   */
  getAllEmployees(): Observable<Employee[]> {
    const employeeList = this.afs
      .collection<Employee>("Employee", (ref) => ref.orderBy("name"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((c) => ({
            employeeId: c.payload.doc.id,
            ...c.payload.doc.data(),
          }));
        })
      );
    return employeeList;
  }

  /**
   * Get the record of particular employee based on the employeeId
   * @param employeeId
   * @returns Observable<Employee>
   */
  getEmployeeById(employeeId: string): Observable<Employee> {
    const employeeData = this.afs
      .doc<Employee>("Employee/" + employeeId)
      .valueChanges();
    return employeeData;
  }

  /**
   * Update the record of an employee in the Employee collection in firestore DB
   * @param employeeId
   * @param employee
   * @returns Promise<void>
   */
  updateEmployee(employeeId: string, employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.afs.doc("Employee/" + employeeId).update(employeeData);
  }

  /**
   * Delete the employee record from the Employee collection in firestore DB
   * @param employeeId
   * @returns Promise<void>
   */
  deleteEmployee(employeeId: string) {
    return this.afs.doc("Employee/" + employeeId).delete();
  }
}
