import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Contact } from '../service/contact';
import { Router , ActivatedRoute } from '@angular/router';
import { ContactService } from '../service/contact.service';
import { MessageDialogComponent, MessageBox } from '../message-box/message.component';

@Component({
  selector: 'contact-login',
  templateUrl: './contact-login.component.html',
  styleUrls: ['./contact-login.component.css'],
  providers: [ContactService]
})

export class ContactLoginComponent implements OnInit {
  username;
  password;
  name;
  fatherName;
  motherName;
  aadhar;
  mobileNumber;
  isRegistration;
  errormessage;
  constructor(private contactService: ContactService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { 
      this.isRegistration = false;
    }
  
  ngOnInit() {
    this.errormessage = '';
  }
  
  onLogin() {
    this.contactService.getloginDetails(this.username, this.password).then(result => {
      if (result._id) {
        window.localStorage.setItem(this.username, result.token);
          /* let dialogRef = this.dialog.open(SampleDialog, {
            width: '500px',
            data: { name: this.username, message:"Are You Ready to Enter on Your World"}
          });
          dialogRef.afterClosed().subscribe(resultfromDialog => {
            if(resultfromDialog.result == "ok") {
              if (result._id) {
                this.errormessage = '';
                this.router.navigateByUrl("/dashboard");
              }
            } 
          });*/
          MessageBox.show(this.dialog, "Are You Ready to Enter on Your World").subscribe( resultfromDialog => {
            if(resultfromDialog.result == "OK") {
              if (result._id) {
                this.errormessage = '';
                this.router.navigateByUrl("/dashboard/"+this.username);
              }
            } 
        });
        } 
      }).catch(e => {
          console.log("login faild...",e);
          var style="margin: 200px; position: absolute; z-index: 70;"
          this.errormessage = "UserName and Password Incorrect";
      });
   }

  onSignUp() {
    this.username='';
    this.password='';
    this.isRegistration = true;
  }
  onRegister() {
    this.errormessage = false;
    this.isRegistration = true;
    var userDeatils = { "username":this.username,
                       "password":this.password,
                       "name":this.name,
                       "fatherName":this.fatherName,
                       "motherName":this.motherName,
                       "aadhar":this.aadhar,
                       "mobileNumber":this.mobileNumber
                      };
    this.contactService.registerContactDetails(userDeatils).then(result => {
      if (result.data) {
          MessageBox.show(this.dialog, `Account Created Successfully..`);
          this.isRegistration = false;
        } else {
          if (result.message == "DUPLICATE_DATA_FOUND") {
            MessageBox.show(this.dialog, `UserName already Exist. Please try with some other Name`);
          } else {
             MessageBox.show(this.dialog, `Account Creation Failed`);
          }
          
        }
    }).catch(e => {
      MessageBox.show(this.dialog, `Account Creation Failed`);
    });
  }
  
  onCancel() {
    this.username='';
    this.password='';
    this.fatherName='';
    this.motherName='';
    this.aadhar='';
    this.name='';
    this.mobileNumber='';
    this.isRegistration = false;
    this.errormessage = '';
    this.router.navigateByUrl("/login");
  }
}

/*
MessageBox.show(this.dialog, this.message, this.title,        
                this.information, this.button,
                this.allow_outside_click, this.style,
                this.width)
    .subscribe( result => {
        console.log(result);
    });

    MessageBox.show(this.dialog, `The result is : ${response}`);
MessageBox.show(this.dialog, `Hello, World!`);

*/

