import { Injectable, Inject } from '@angular/core';
import { Contact, Login } from './contact';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Injectable()
export class ContactService {
    private contactsUrl = '/api/users';
    constructor (private http: Http) {}

    @Inject('LOCALSTORAGE') 
    private localStorage: any;

    createAuthorizationHeader(tokenKey:string):any {
        var headers = new Headers();
        var token = window.localStorage.getItem(tokenKey);
        headers.append('Authorization', 'Bearer ' +token); 
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
      }

    // get("/api/contacts")
    getContacts(tokenKey:string): Promise<Contact[]> {
        return this.http.get(this.contactsUrl, {headers: this. createAuthorizationHeader(tokenKey)})
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
    }

    getloginDetails(username:String, password:String): Promise<any> {
        return this.http.post("/api/auth/login", {"username":username, "password":password})
                 .toPromise()
                 .then(response => response.json())
                 .catch(this.handleError);
    }

    getloginDetailsByUserName(username:string): Promise<any> {
        
        return this.http.get("/api/auth/logindetails/"+username, {headers: this.createAuthorizationHeader(username)})
                 .toPromise()
                 .then(response => response.json())
                 .catch(this.handleError);
    }


    registerContactDetails(data:Login): Promise<any> {
    
        return this.getloginDetailsByUserName(data.username).then(response =>{
            if(!response.data) {
                console.log("registerContactDetails...",data);
                return this.http.post("/api/auth/signup",data)
                 .toPromise()
                 .then(response => response.json())
                 .catch(this.handleError);
            } else{
                var message = {"message":"DUPLICATE_DATA_FOUND",data:null}
                return message
            }
        });
    }

    getContactById(id: string, tokenkey:string): Promise<Contact> {
        return this.http.get(this.contactsUrl+"/"+id,{headers: this.createAuthorizationHeader(tokenkey)})
                   .toPromise()
                   .then(response => response.json().data as Contact)
                   .catch(this.handleError);
      }
    // post("/api/contacts")
    createContact(newContact: Contact, tokenkey:string): Promise<Contact> {
        newContact.editContact = false;
        return this.http.post(this.contactsUrl, newContact, {headers: this.createAuthorizationHeader(tokenkey)})
                 .toPromise()
                 .then(response => response.json().data as Contact)
                 .catch(this.handleError);
    }

    getAllContactByLinkedId(rootContactId: string, tokenkey:string): Promise<Contact[]> {
        return this.http.get(this.contactsUrl +"/allLinked/"+rootContactId,{headers: this.createAuthorizationHeader(tokenkey)})
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
    }
    
    // delete("/api/contacts/:id")
    deleteContact(deleteContactId: String, tokenkey:string): Promise<Contact> { 
        return this.removeProfilePhotos(deleteContactId, tokenkey).then(response => {
            return this.http.delete(this.contactsUrl + '/' + deleteContactId, {headers: this.createAuthorizationHeader(tokenkey)})
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.handleError);
        });
    }

    // put("/api/contacts/:id")
    updateContact(putContact: Contact, tokenkey:string): Promise<Contact> {
      var putUrl = this.contactsUrl + '/' + putContact._id;
      console.log("Put url.........",putUrl);
      console.log("putContact .........",putContact);
      return this.http.put(putUrl, putContact, {headers: this.createAuthorizationHeader(tokenkey)})
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.handleError);
    }

    private handleError (error: any): Promise<any> {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console
      return Promise.reject(errMsg);
    }
    
    readProfilePhoto(fileName: String):Promise<String> {
        return Promise.resolve(fileName);
    }

    removeProfilePhotos(fileName: String, tokenkey:string):Promise<any> {
        console.log("Read file Name :",fileName);
        return this.http.delete(this.contactsUrl +"/profilePhoto/"+fileName,{headers: this.createAuthorizationHeader(tokenkey)}).toPromise()
        .then(response=>response.json()).catch(this.handleError);
    }

    searchContacts(key: any, value:any, tokenkey:string): Promise<Contact[]> {
        var query = {"key":key,"value":value};
        return this.http.post(this.contactsUrl+"/search", query,{headers: this.createAuthorizationHeader(tokenkey)})
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
    }

    private defaultFileErrorHandler (error: any): Promise<any> {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console
      return Promise.resolve("../../assets/user.jpg");
    }
    
    uploadProfilePhoto(contact: Contact, files:Array<File>, tokenkey:string) : Promise<any> {
        let headers = new Headers();
        console.log("fileName.........",contact.userRegistrationId);
        var fresult = null;
        var fileURL = contact._id;
        this.removeProfilePhotos(fileURL, tokenkey).then(response => {
            this.makeFileRequest(this.contactsUrl+'/upload', fileURL , files, tokenkey).then((result) => {
                console.log(result);
                if(result) {
                  fresult = fileURL;
                  contact.profilePhotoPath = this.contactsUrl+'/profilePhoto/'+fileURL;
                  var putUrl = this.contactsUrl + '/' + contact._id;  
                  this.http.put(putUrl, contact,{headers: this.createAuthorizationHeader(tokenkey)})
                     .toPromise()
                     .then(response => response.json() as Contact)
                     .catch(this.handleError);
                }
            });
        }).catch(this.defaultFileErrorHandler);
        return Promise.resolve(fresult);
    }
  
    makeFileRequest(url: string, params: String, files: Array<File>, tokenKey) {
        return new Promise((resolve, reject) => {
            var token = window.localStorage.getItem(tokenKey);
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i = 0; i < files.length; i++) {
                formData.append("file", files[i], files[i].name);
                formData.append("filename", params);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }
}

