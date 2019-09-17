import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   users = [

   ];
  user = {
    username: '',
    password: '',
    remember: false
  };

  constructor(public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit() {
  }

  onSubmit() {
    this.users.push(this.user);
    console.log(this.users);
    // this.dialogRef.close();
  }

}
