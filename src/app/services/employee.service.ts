import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  orderBy,
  getDoc,
  doc,
  DocumentData,
  setDoc,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Employee } from '../models/employee';
import { City } from '../models/city';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  firestore: Firestore = inject(Firestore);

  /**
   * Retrieves a list of cities from the Firestore 'City' collection.
   *
   * @returns {Observable<City[]>} An observable that emits an array of city objects.
   */
  getCityList(): Observable<City[]> {
    const itemCollection = collection(this.firestore, 'City');
    return collectionData<City[]>(itemCollection);
  }

  /**
   * Retrieves all employees from the Firestore 'Employee' collection, ordered by name.
   *
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of employee objects.
   * Each object contains the employeeId and the data from the Firestore document.
   */
  async getAllEmployees(): Promise<Array<Object>> {
    const employeeQuery = query(
      collection(this.firestore, 'Employee'),
      orderBy('name')
    );
    const employeeQuerySnapshot = await getDocs(employeeQuery);
    return employeeQuerySnapshot.docs.map((doc) => {
      return { employeeId: doc.id, ...doc.data() };
    });
  }

  /**
   * Retrieves an employee's data from the Firestore 'Employee' collection by their ID.
   *
   * @param {string} employeeId - The ID of the employee to retrieve.
   * @returns {Promise<DocumentData | undefined>} A promise that resolves to the employee's data,
   * or undefined if the employee does not exist.
   */
  async getEmployeeById(employeeId: string): Promise<DocumentData | undefined> {
    const employeeData = await getDoc(
      doc(this.firestore, 'Employee', employeeId)
    );

    return employeeData.data();
  }

  /**
   * Saves a new employee to the Firestore 'Employee' collection.
   *
   * @param {Employee} employee - The employee object to be saved.
   * @returns {Promise<void>} A promise that resolves when the employee has been successfully saved.
   */
  async saveEmployee(employee: Employee): Promise<void> {
    await addDoc(collection(this.firestore, 'Employee'), employee);
  }

  /**
   * Updates an existing employee's data in the Firestore 'Employee' collection.
   *
   * @param {string} employeeId - The ID of the employee to update.
   * @param {Employee} employee - The employee object containing the updated data.
   * @returns {Promise<void>} A promise that resolves when the employee's data has been successfully updated.
   */
  async updateEmployee(employeeId: string, employee: Employee): Promise<void> {
    await setDoc(doc(this.firestore, 'Employee', employeeId), employee);
  }

  /**
   * Deletes an employee from the Firestore 'Employee' collection by their ID.
   *
   * @param {string | undefined} employeeId - The ID of the employee to delete. If undefined, no action is taken.
   * @returns {Promise<void>} A promise that resolves when the employee has been successfully deleted.
   */
  async deleteEmployee(employeeId: string | undefined): Promise<void> {
    if (employeeId) {
      await deleteDoc(doc(this.firestore, 'Employee', employeeId));
    }
  }
}
