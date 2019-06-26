import { Component, OnInit, Input } from "@angular/core";
import { User } from "../models/user";
import { ModalController } from "@ionic/angular";
import { UserService } from '../services/user.service';

@Component({
  selector: "app-user-editor",
  templateUrl: "./user-editor.page.html",
  styleUrls: ["./user-editor.page.scss"]
})
export class UserEditorPage implements OnInit {
  @Input()
  private user: User = { name: "", surname: "", email: "" };
  constructor(private modalCtrl: ModalController, private users: UserService) {}

  ngOnInit() {}

  close() {
    console.log("[UserEditorPage] close()");
    this.modalCtrl.dismiss();
  }
  save() {
    console.log("[UserEditorPage] save()");
    this.users.updateUser(this.user);
    this.modalCtrl.dismiss();
  }
}
