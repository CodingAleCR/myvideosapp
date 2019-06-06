import { Component, OnInit, Input } from "@angular/core";
import { Video } from "../models/video";
import { ModalController, AlertController } from "@ionic/angular";
import { CameraOptions, Camera } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-video-editor",
  templateUrl: "./video-editor.page.html",
  styleUrls: ["./video-editor.page.scss"]
})
export class VideoEditorPage implements OnInit {
  @Input()
  private mode = "view";

  @Input()
  private video: Video;

  constructor(
    private camera: Camera,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // clone video
    this.video = this.clone(this.video);
  }

  private clone(video: Video): Video {
    return {
      id: video.id,
      type: video.type,
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      tags: video.tags,
      duration: video.duration,
      date: video.date,
      width: video.width,
      height: video.height
    };
  }

  close() {
    console.log("[VideoEditorPage] close()");
    this.modalCtrl.dismiss();
  }

  save() {
    console.log("[VideoEditorPage] save()");
    this.modalCtrl.dismiss(this.video);
  }

  selectThumbnail() {
    console.log("[VideoEditorPage] selectThumbnail()");
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera
      .getPicture(options)
      .then(url => {
        this.setThumbnail("file://" + url);
      })
      .catch(err => {
        // Handle error
        this.alertCtrl
          .create({
            header: "Error",
            message: "ERROR selecting video: " + JSON.stringify(err),
            buttons: ["OK"]
          })
          .then(alert => alert.present());
      });
  }

  enterThumbnail() {
    console.log("[VideoEditorPage] enterThumbnail()");
    let promise = this.alertCtrl.create({
      header: "Select thumbnail",
      message: "Enter thumbnail URL",
      inputs: [{ name: "url", placeholder: "URL" }],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Accept",
          handler: data => {
            console.log("URL " + data.url + " entered!!");
            this.setThumbnail(data.url);
          }
        }
      ]
    });
    promise.then(prompt => prompt.present());
  }

  takeThumbnail() {
    console.log("[VideoEditorPage] takeThumbnail()");
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera
      .getPicture(options)
      .then(url => {
        this.setThumbnail("file://" + url);
      })
      .catch(err => {
        // Handle error
        this.alertCtrl
          .create({
            header: "Error",
            message: "ERROR selecting video: " + JSON.stringify(err),
            buttons: ["OK"]
          })
          .then(alert => alert.present());
      });
  }

  setThumbnail(url: string) {
    console.log(`[VideoEditorPage] setThumbnail(${url})`);
    if (this.video.thumbnail) {
      this.video.thumbnail.url = url;
    } else {
      this.video.thumbnail = {
        url: url,
        width: 64,
        height: 64
      }
    }
  }
}
