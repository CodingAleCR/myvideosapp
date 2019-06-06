import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { Video } from "../models/video";

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.page.html",
  styleUrls: ["./video-player.page.scss"]
})
export class VideoPlayerPage implements OnInit {
  @Input()
  private video: Video;

  constructor(
    private domSanitizer: DomSanitizer,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  close() {
    console.log("[VideoEditorPage] close()");
    this.modalCtrl.dismiss();
  }
}
