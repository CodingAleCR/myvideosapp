import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  ModalController,
  AlertController,
  ActionSheetController
} from "@ionic/angular";

import { Video } from "../models/video";
import { YoutubeVideosService } from "../services/youtube-videos.service";
import { VideoEditorPage } from "../video-editor/video-editor.page";
import { OverlayEventDetail } from "@ionic/core";
import { VideoPlayerPage } from '../video-player/video-player.page';
import { PlaylistsSelectorPage } from '../playlists-selector/playlists-selector.page';

@Component({
  selector: "app-youtube-videos",
  templateUrl: "./youtube-videos.page.html",
  styleUrls: ["./youtube-videos.page.scss"]
})
export class YoutubeVideosPage implements OnInit {
  private query = "";
  private myVideos: Video[] = [];

  constructor(
    private videos: YoutubeVideosService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private changes: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("ngOnInit YoutubeVideosPage");
    this.searchVideos();
  }

  searchVideos(evt?) {
    console.log("[YoutubeVideosPage] searchVideos()");
    let query = evt ? evt.target.value.trim() : this.query;
    this.videos.findVideos(query).then(videos => {
      this.myVideos = videos;
      this.changes.detectChanges();
    });
  }

  showMenu(video) {
    this.actionSheetCtrl
      .create({
        buttons: [
          {
            text: "Add to playlist",
            icon: "star",
            handler: () => {
              console.log("Play video!!");
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
            text: "Properties",
            icon: "information-circle",
            handler: () => {
              console.log("View video properties!!");
              this.showVideoProperties(video);
            }
          }
        ]
      })
      .then(actionSheet => actionSheet.present());
  }

  addToPlaylist(video: Video) {
    console.log(`[YoutubeVideosPage] addToPlaylist(${video.id})`);
    this.modalCtrl
      .create({
        component: PlaylistsSelectorPage,
        componentProps: { video: video }
      })
      .then(modal => modal.present());
  }

  playVideo(video: Video) {
    console.log(`[YoutubeVideosPage] playVideo(${video.id})`);
    this.modalCtrl
      .create({
        component: VideoPlayerPage,
        componentProps: { video: video }
      })
      .then(modal => modal.present());
  }

  showVideoProperties(video: Video) {
    console.log(`[YoutubeVideosPage] showVideoProperties(${video.id})`);
    this.modalCtrl
      .create({
        component: VideoEditorPage,
        componentProps: { mode: "view", video: video }
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
}
