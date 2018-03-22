import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { Service } from '../../service/service';

import { Storage } from '@ionic/storage';

// to fix image preview in IOS
import { normalizeURL } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers: [Service]
})
export class AccountPage {
  username: string;
  userExistsMessage:String = "";
  loading = false;
  profileImage: string = "http://www.gravatar.com/avatar?d=mm&s=140";

  constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData,
              public service:Service, public storage: Storage) {

    // Set profile image
    this.storage.get('userprofileimage').then((value) => {
      if(value) {
        this.profileImage = normalizeURL(cordova.file.dataDirectory + value);
      }
    });
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    this.loading = true;
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [{
        text: 'Cancel',
          handler: () => {
            this.loading = false;
          }
      }]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        // updating into database
        if(data.username) {
          if(data.username != this.username) {
            let updatedValue = {'user_username': this.username, 'user_updatedetail':'user_username', 'user_updatedetailvalue':data.username};
            this.service.updateDetails(updatedValue).subscribe(
              result => {
                console.log(result);
                if(result.message == "Updated Successfully.") {
                    this.username = data.username;
                    this.userData.setUsername(data.username); // update in localstorage
                    this.username = data.username;  // update in current page
                    this.userData.presentAlert("Congratulation !! ", "Username "+result.message);
                    this.loading = false;
                }
                else {
                    //this.userExistsMessage = "User do not Exists";
                    //this.loading = false;
                }
              },
            (error) => {
                      console.log("Error happened" + error);
                      this.userExistsMessage = "Server Error";
                      this.loading = false;
              });
          } else { this.loading = false; }
        } else {
          this.userData.presentAlert("Sorry !! ", "Username can not be empty.");
          this.loading = false;
        }
      }
    });

    alert.present();
    //this.loading = false;
  }
  
  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
    this.loading = true;
    let alert = this.alertCtrl.create({
      title: 'Change Password',
      buttons: [{
          text: 'Cancel',
            handler: () => {
              this.loading = false;
            }
      }]
    });
    alert.addInput({
      name: 'userpassword',
      value: '',
      placeholder: 'Change Password'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        // updating into database
        if(data.userpassword) {
          let updatedValue = {'user_username': this.username, 'user_updatedetail':'user_password', 'user_updatedetailvalue':data.userpassword};
          this.service.updateDetails(updatedValue).subscribe(
            result => {
              console.log(result);
              if(result.message == "Updated Successfully.") {
                  this.userData.presentAlert("Congratulation !! ", "Password "+result.message);
                  this.loading = false;
              }
              else {
                  //this.userExistsMessage = "User do not Exists";
                  //this.loading = false;
              }
            },
            (error) => {
                    console.log("Error happened" + error);
                    this.userExistsMessage = "Server Error";
                    this.loading = false;
            });
        } else {
          this.userData.presentAlert("Sorry !! ", "Password can not be empty.");
          this.loading = false;
        }
      }
    });

    alert.present();
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

  updateProfileImage() {
    this.nav.push('ProfileImagePage');
  }

  support() {
    this.nav.push('SupportPage');
  }
}
