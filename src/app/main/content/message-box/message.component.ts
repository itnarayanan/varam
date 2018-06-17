import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'message-dialog',
    styles:['./message.component.css'],
    templateUrl: './message-dialog.component.html',
  })
  export class MessageDialogComponent {
    name;
    message;
    constructor(
      public dialogRef: MatDialogRef<MessageDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { 
        this.name = data.name;
        this.message = data.message;
      }
    
      onOk(): void {
        this.dialogRef.close({result: "OK"});
      }
      onCancel(): void {
        this.dialogRef.close({result: "CANCEL"});
      }
      
      onNoClick(): void {
        this.dialogRef.close();
      }
  
  }

  export class MessageBox {

    static show(dialog: MatDialog, message, title = "Alert",                    
                information = "", button = 0, 
                allow_outside_click = false, 
                style = 0, width = "500px") {
      const dialogRef = dialog.open( MessageDialogComponent, {        
            data: {
                    title: title || "Alert",
                    message: message,
                    information: information,
                    button: button || 0,
                    style: style || 0,
                    allow_outside_click: allow_outside_click || false
            },
            width: width
      });    
      return dialogRef.afterClosed();     
    }
  }