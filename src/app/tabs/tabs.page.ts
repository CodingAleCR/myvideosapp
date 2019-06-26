import { Component } from "@angular/core";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ModalController, MenuController } from "@ionic/angular";
import { User } from "../models/user";
import { UserEditorPage } from "../user-editor/user-editor.page";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"]
})
export class TabsPage {
  private user: User;

  constructor(
    private users: UserService,
    private router: Router,
    private modalCtrl: ModalController,
    private menu: MenuController
  ) {
    if (!users.getSessionToken()) {
      router.navigateByUrl("/login");
    }
    this.user = this.users.getSessionUser();
  }

  editUser() {
    console.log("[TabsPage] editUser()");
    this.modalCtrl
      .create({
        component: UserEditorPage,
        componentProps: { mode: "edit", user: this.user }
      })
      .then(modal => {
        modal
          .onDidDismiss()
          .then(evt => (this.user = this.users.getSessionUser()));
        modal.present();
      });
  }

  logout() {
    console.log("[TabsPage] logout()");
    this.users.logout().then(() => {
      this.router.navigateByUrl("/login");
    });
  }
}
