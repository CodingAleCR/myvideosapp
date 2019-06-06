import { Component, OnInit, Input } from "@angular/core";
import { Playlist } from "../models/playlist";
import { ModalController, AlertController } from "@ionic/angular";
import { CameraOptions, Camera } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-playlist-editor",
  templateUrl: "./playlist-editor.page.html",
  styleUrls: ["./playlist-editor.page.scss"]
})
export class PlaylistEditorPage implements OnInit {
  @Input()
  private mode = "view";

  @Input()
  private playlist: Playlist;
  constructor(
    private camera: Camera,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    //clone playlist
    this.playlist = this.clone(this.playlist);
  }

  private clone(playlist: Playlist): Playlist {
    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      thumbnail: playlist.thumbnail,
      date: playlist.date,
      count: playlist.count
    };
  }

  close() {
    console.log("[PlaylistEditorPage] close()");
    this.modalCtrl.dismiss();
  }

  save() {
    console.log("[PlaylistEditorPage] save()");
    this.modalCtrl.dismiss(this.playlist);
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
    if (this.playlist.thumbnail) {
      this.playlist.thumbnail.url = url;
    } else {
      this.playlist.thumbnail = {
        url: url,
        width: 64,
        height: 64
      };
    }
  }
}
