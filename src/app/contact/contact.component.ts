import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  feedbackForm: FormGroup;
  contactType = contactType;
  // @ts-ignore
  @ViewChild('fform') feedbackFormDirective;
  formErrors = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  };

  validationMessages = {
    firstName: {
      required:      'First Name is required.',
      minlength:     'First Name must be at least 2 characters long.',
      maxlength:     'firstName cannot be more than 25 characters long.'
    },
    lastName: {
      required:      'Last Name is required.',
      minlength:     'Last Name must be at least 2 characters long.',
      maxlength:     'Last Name cannot be more than 25 characters long.'
    },
    phoneNumber: {
      required:      'Tel. number is required.',
      pattern:       'Tel. number must contain only numbers.'
    },
    email: {
      required:      'Email is required.',
      email:         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder) {
    this.createForm();
  }
  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      phoneNumber: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contactType: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    console.log(this.feedbackForm.value);
    this.feedbackForm.reset();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
