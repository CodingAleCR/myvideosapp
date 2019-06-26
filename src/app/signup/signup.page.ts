import { Component, OnInit } from "@angular/core";
import { NavController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { User } from "../models/user";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  private email = "";
  private password = "";
  private validationPassword = "";
  private name = "";
  private surname = "";
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private users: UserService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  close() {
    console.log("[SignupPage] close()");
    this.navCtrl.back();
  }

  signup() {
    if (!this.isFormValid()) {
      this.alertCtrl
        .create({
          header: "Oops!",
          message: "Make sure that all the fields are filled.",
          buttons: [
            {
              text: "OK",
              role: "cancel"
            }
          ]
        })
        .then(alert => alert.present());
    } else if (!this.arePasswordsValid()) {
      this.alertCtrl
        .create({
          header: "Oops!",
          message: "Passwords do not match.",
          buttons: [
            {
              text: "OK",
              role: "cancel"
            }
          ]
        })
        .then(alert => alert.present());
    } else {
      let user: User = {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname
      };
      this.users
        .createUser(user)
        .then(user => {
          this.users.login(this.email, this.password).then(success => {
            if (success) {
              this.router.navigateByUrl("/tabs");
            }
          });
        })
        .catch(reason => {
          this.alertCtrl
            .create({
              header: "Oops!",
              message:
                "There was a problem creating your user. Please try again later!",
              buttons: [
                {
                  text: "OK",
                  role: "cancel"
                }
              ]
            })
            .then(alert => alert.present());
        });
    }
  }

  isFormValid(): boolean {
    return (
      this.email.length > 0 &&
      this.name.length > 0 &&
      this.surname.length > 0 &&
      this.password.length > 0 &&
      this.validationPassword.length > 0
    );
  }

  arePasswordsValid(): boolean {
    return this.password === this.validationPassword;
  }
}
