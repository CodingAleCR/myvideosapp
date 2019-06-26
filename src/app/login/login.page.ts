import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  private email = "";
  private password = "";
  constructor(
    private router: Router,
    private users: UserService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  login() {
    console.log("[LoginPage] login()");
    if (this.email.length > 0 && this.password.length > 0) {
      this.users
        .login(this.email, this.password)
        .then(success => {
          if (success) {
            this.router.navigateByUrl("/tabs");
          }
        })
        .catch(err => {
          this.alertCtrl
            .create({
              header: "Oops!",
              message: "Make sure that your username and password are the correct ones.",
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
}
