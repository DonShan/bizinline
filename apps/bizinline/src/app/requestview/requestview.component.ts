import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'bizinline-requestview',
  templateUrl: './requestview.component.html',
  styleUrls: ['./requestview.component.scss']
})
export class RequestviewComponent {

  myForm: FormGroup;

  companyName = new FormControl();
  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  message = new FormControl();


  constructor(private formBuilder: FormBuilder) {
 
      this.myForm = this.formBuilder.group({
        companyName: this.companyName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        message: this.message,
      }); 
  }

  onSubmit() {
    // TODO: Handle form submission
    console.log(this.myForm.value);
  }

}
 

