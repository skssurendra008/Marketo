import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular'; 

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';
import { Service } from '../../service/service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html',
  providers:[Service]
})
export class LoginPage {
  login: UserOptions = { user_username: '', user_email:'', user_password: '' };
  submitted = false;
  userExistsMessage:String = "";
  loading = false;

  constructor(public navCtrl: NavController, public userData: UserData, private service: Service,
              public storage: Storage) { 
      
      // Set SignUp username in login page
      this.storage.get('username').then((value) => {
        this.login.user_username = value;
      });
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    this.loading = true;
    if (form.valid) {
      // this.userData.login(this.login.username);
      // this.navCtrl.push(TabsPage);

      this.service.verifyUser(this.login).subscribe(
        result => {
          console.log(result);
          if(result.message == "User Exists") {
            //console.log("UserData = ");
            //console.log(result.userData);
            //console.log(result.userData.user_profileimage);
              this.userData.profileimage(result.userData.user_profileimage);
              this.userData.login(this.login.user_username);
              this.navCtrl.push(TabsPage);
              this.loading = false;
          }
          else if (result.message == "Password Mismatch") {
              this.userExistsMessage = "Password Mismatch";
              this.loading = false;
          }
          else {
              this.userExistsMessage = "User do not Exists";
              this.loading = false;
          }
         },
        (error) => {
                console.log("Error happened" + error);
                this.userExistsMessage = "Server Error";
                this.loading = false;
        });
    }
    else { 
      this.loading = false;
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
