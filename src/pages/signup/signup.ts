import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

//import { TabsPage } from '../tabs-page/tabs-page';
import { LoginPage } from '../login/login';
import { Service } from '../../service/service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html',
  providers: [Service]
})
export class SignupPage {
  signup: UserOptions = { user_username: '', user_email:'', user_password: '' };
  submitted = false;
  userExistsMessage:String = "";
  loading = false;

  constructor(public navCtrl: NavController, public userData: UserData, private service: Service,
              private alertCtrl: AlertController) {}

  onSignup(form: NgForm) {
    this.submitted = true;
    this.loading = true;
    console.log(this.signup);

    if (form.valid) {
      this.service.registerUser(this.signup).subscribe(
        data => {
            console.log(data);
            if (data.message == "User Created Successfully.") {
              this.userData.signup(this.signup.user_username);
              // this.navCtrl.push(TabsPage);
              this.loading = false;
              this.presentAlert("Congratulation !! "+this.signup.user_username, data.message);
              this.navCtrl.push(LoginPage);
            }
            else {
              this.userExistsMessage = data.message;
              this.loading = false;
            }
        },
        error => {
            console.log("Error",error);
            this.userExistsMessage = "Server Error";
            this.loading = false;
        });
    }
    else {
      this.loading = false;
    }
  }

  presentAlert(Title,message) {
    let alert = this.alertCtrl.create({
      title: Title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
