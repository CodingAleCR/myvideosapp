import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { OverlayEventDetail } from "@ionic/core";
import {
  ActionSheetController,
  AlertController,
  ModalController,
  LoadingController
} from "@ionic/angular";
import { CameraOptions, Camera } from "@ionic-native/camera/ngx";
import { VideoEditorPage } from "../video-editor/video-editor.page";
import { Video } from "../models/video";
import { VideosService } from "../services/videos.service";
import { VideoPlayerPage } from "../video-player/video-player.page";
import { PlaylistsSelectorPage } from "../playlists-selector/playlists-selector.page";

@Component({
  selector: "app-my-videos",
  templateUrl: "./my-videos.page.html",
  styleUrls: ["./my-videos.page.scss"]
})
export class MyVideosPage implements OnInit {
  private query = "";
  private myVideos: Video[] = [];

  constructor(
    private loadingController: LoadingController,
    private camera: Camera,
    private videos: VideosService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private changes: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("ngOnInit MyVideosPage");
    this.searchVideos();
  }

  showMenu(video) {
    this.actionSheetCtrl
      .create({
        buttons: [
          {
            text: "Add to Playlist",
            icon: "star",
            handler: () => {
              console.log("Add video to playlis!!");
              this.addToPlaylist(video);
            }
          },
          {
            text: "Play",
            icon: "play",
            handler: () => {
              console.log("Play video!!");
              this.playVideo(video);
            }
          },
          {
            text: "Edit",
            icon: "create",
            handler: () => {
              console.log("Edit video!!");
              this.editVideo(video);
            }
          },
          {
            text: "Delete",
            icon: "trash",
            handler: () => {
              console.log("Delete video!!");
              this.deleteVideo(video);
            }
          }
        ]
      })
      .then(actionSheet => actionSheet.present());
  }

  addToPlaylist(video: Video) {
    console.log(`[MyVideosPage] addToPlaylist(${video.id})`);
    this.modalCtrl
      .create({
        component: PlaylistsSelectorPage,
        componentProps: { video: video }
      })
      .then(modal => modal.present());
  }

  playVideo(video: Video) {
    console.log(`[MyVideosPage] playVideo(${video.id})`);
    this.modalCtrl
      .create({
        component: VideoPlayerPage,
        componentProps: { video: video }
      })
      .then(modal => modal.present());
  }

  editVideo(video: Video) {
    console.log(`[MyVideosPage] editVideo(${video.id})`);
    this.modalCtrl
      .create({
        component: VideoEditorPage,
        componentProps: { mode: "edit", video: video }
      })
      .then(modal => {
        modal.onDidDismiss().then((evt: OverlayEventDetail) => {
          if (evt && evt.data) {
            this.videos.updateVideo(evt.data).then(() => this.searchVideos());
          }
        });
        modal.present();
      });
  }

  deleteVideo(video: Video) {
    console.log(`[MyVideosPage] deleteVideo(${video.id})`);
    this.alertCtrl
      .create({
        header: "Delete video",
        message: "Are you sure?",
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
            handler: () => {
              this.videos.removeVideo(video.id).then(() => this.searchVideos());
            }
          }
        ]
      })
      .then(alert => alert.present());
  }

  searchVideos(evt?) {
    console.log("[MyVideosPage] searchVideos()");
    this.loadingController
      .create({
        message: "Loading videos..."
      })
      .then(loading => {
        loading.present();
        let query = evt ? evt.target.value.trim() : this.query;
        this.videos.findVideos(query).then(videos => {
          this.myVideos = videos;
          this.changes.detectChanges();
          loading.dismiss();
        });
      });
  }

  enterVideo() {
    console.log("[MyVideosPage] enterVideo()");
    let promise = this.alertCtrl.create({
      header: "Select video",
      message: "Enter video URL",
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
            this.addVideo(data.url);
          }
        }
      ]
    });
    promise.then(prompt => prompt.present());
  }

  selectVideo() {
    console.log("[MyVideosPage] selectVideo()");
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO
    };
    this.camera
      .getPicture(options)
      .then(url => {
        this.addVideo("file://" + url);
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

  addVideo(url: string) {
    console.log(`[MyVideosPage] addVideo(${url})`);
    this.loadingController
      .create({
        message: "Looking for video..."
      })
      .then(loading => {
        loading.present();
        this.readVideoInfo(url)
          .then(video => {
            loading.dismiss();
            this.modalCtrl
              .create({
                component: VideoEditorPage,
                componentProps: { mode: "add", video: video }
              })
              .then(modal => {
                modal.onDidDismiss().then((evt: OverlayEventDetail) => {
                  if (evt && evt.data) {
                    this.loadingController
                      .create({
                        message: "Adding video..."
                      })
                      .then(loading => {
                        loading.present();
                        this.videos.addVideo(evt.data).then(() => {
                          loading.dismiss();
                          this.searchVideos();
                        });
                      });
                  }
                });
                modal.present();
              });
          })
          .catch(err => {
            loading.dismiss();
            // Handle error
            this.alertCtrl
              .create({
                header: "Error",
                message: "ERROR reading video info: " + JSON.stringify(err),
                buttons: ["OK"]
              })
              .then(alert => alert.present());
          });
      });
  }

  readVideoInfo(url: string, secs?: number): Promise<Video> {
    console.log(`readVideoInfo(${url},${secs})`);
    return new Promise((resolve, reject) => {
      let video: Video = {
        type: "local",
        url: url,
        title: "",
        description: "",
        date: new Date().toDateString()
      };
      let videoNode: HTMLVideoElement = document.createElement("video");
      videoNode.onloadedmetadata = () => {
        // - get basic info
        video.width = videoNode.videoWidth;
        video.height = videoNode.videoHeight;
        video.duration = String(videoNode.duration) + " secs";
        // - move to frame
        videoNode.currentTime = secs ? Math.min(secs, videoNode.duration) : 0;
      };
      videoNode.onseeked = ev => {
        // - capture thumbnail
        try {
          let canvas = document.createElement("canvas");
          canvas.height = 180;
          canvas.width = 320;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(videoNode, 0, 0, canvas.width, canvas.height);
          video.thumbnail = {
            url: canvas.toDataURL(),
            height: canvas.height,
            width: canvas.width
          };
        } catch (err) {
          console.log("videoNode.onseeked_error=" + JSON.stringify(err));
        } finally {
          resolve(video);
        }
      };
      videoNode.onerror = ev => {
        let error = {
          code: videoNode.error.code,
          message: videoNode.error.message
        };
        reject(error);
      };
      videoNode.src = url;
    });
  }
}
