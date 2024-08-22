import { FormControl } from '@angular/forms';

export interface EmployeeForm {
  name: FormControl<string>;
  gender: FormControl<string>;
  department: FormControl<string>;
  city: FormControl<string>;
}
