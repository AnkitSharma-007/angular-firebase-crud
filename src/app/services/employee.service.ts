import { Injectable } from "@angular/core";
import { Employee } from "src/models/employee";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { City } from "src/models/city";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private afs: AngularFirestore) {}

  // Get the list of all cities from the City collection in firestore DB
  getCityList() {
    return this.afs.collection<City>("City").valueChanges();
  }

  // Add a new employee record into the Employee collection in firestore DB
  saveEmployee(employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.afs.collection("Employee").add(employeeData);
  }

  // Get the list of all employee record from the Employee collection
  getAllEmployees() {
    const employee = this.afs
      .collection<Employee>("Employee", (ref) => ref.orderBy("name"))
      .valueChanges({ idField: "employeeId" });

    return employee;
  }

  // Get the record of particular employee based on the employeeId
  getEmployeeById(employeeId: string) {
    const employeeData = this.afs
      .doc<Employee>("Employee/" + employeeId)
      .valueChanges();

    return employeeData;
  }

  // Update the record of an employee in the Employee collection in firestore DB
  updateEmployee(employeeId: string, employee: Employee) {
    const employeeData = JSON.parse(JSON.stringify(employee));
    return this.afs.doc("Employee/" + employeeId).update(employeeData);
  }

  // Delete the employee record from the Employee collection in firestore DB
  deleteEmployee(employeeId: string) {
    return this.afs.doc("Employee/" + employeeId).delete();
  }
}
