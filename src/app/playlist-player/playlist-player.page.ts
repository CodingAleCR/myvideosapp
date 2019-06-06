import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Video } from "../models/video";
import { DomSanitizer } from "@angular/platform-browser";
import { ModalController, ToastController } from "@ionic/angular";
import { Playlist } from "../models/playlist";
import { PlaylistsService } from "../services/playlists.service";

declare var window;
declare var YT;

@Component({
  selector: "app-playlist-player",
  templateUrl: "./playlist-player.page.html",
  styleUrls: ["./playlist-player.page.scss"]
})
export class PlaylistPlayerPage implements OnInit {
  @Input()
  private playlist: Playlist;

  private index: number;
  private video: Video;
  private myVideos: Video[] = [];
  private player: any;
  private playerApiScript: any;

  constructor(
    private playlists: PlaylistsService,
    private domSanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private changes: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.createYoutubeScript();
    // window.onYouTubeIframeAPIReady = () => {
    //   this.onYouTubeIframeAPIReady();
    // };

    this.fetchVideos();
  }

  fetchVideos() {
    console.log("[PlaylistVideosPage] fetchPlaylistVideos()");
    this.playlists.listVideos(this.playlist.id).then(videos => {
      this.index = 0;
      this.myVideos = videos;
      this.video = videos[this.index];
      this.changes.detectChanges();
    });
  }

  close() {
    console.log("[PlaylistPlayerPage] close()");
    this.modalCtrl.dismiss();
  }

  async playNext() {
    console.log("[PlaylistPlayerPage] playNext()");
    if (++this.index < this.myVideos.length) {
      this.video = this.myVideos[this.index];
    } else {
      const toast = await this.toastCtrl.create({
        message: `This is the last video on the playlist.`,
        duration: 2000,
        showCloseButton: true
      });
      toast.present();
    }
  }

  async playPrevious() {
    console.log("[PlaylistPlayerPage] playPrevious()");
    if (--this.index > -1) {
      this.video = this.myVideos[this.index];
    } else {
      const toast = await this.toastCtrl.create({
        message: `This is the first video on the playlist.`,
        duration: 2000,
        showCloseButton: true
      });
      toast.present();
    }
  }

  // // This method creates the youtube script to add.
  // createYoutubeScript() {
  //   this.playerApiScript = document.createElement("script");
  //   this.playerApiScript.type = "text/javascript";
  //   this.playerApiScript.src = "https://www.youtube.com/iframe_api";
  // }

  // // This method creates the iframe inside a div.
  // createYoutubePlayer() {
  //   this.player = new YT.Player("ytplayer", {
  //     height: "100%",
  //     width: "100%",
  //     events: {
  //       onReady: (event: any) => {
  //         this.onPlayerReady(event);
  //       },
  //       onStateChange: (event: any) => {
  //         this.onPlayerStateChange(event);
  //       }
  //     }
  //   });
  // }

  // // The API calls this function when the Youtube Iframe API is ready.
  // onYouTubeIframeAPIReady() {
  //   console.log("[PlaylistVideosPage] onYouTubeIframeAPIReady()");
  //   this.createYoutubePlayer();
  // }

  // // The API calls this function when the player is ready to play.
  // onPlayerReady(event: any) {
  //   console.log("[PlaylistVideosPage] onReady()");
  //   if (this.video.type === "youtube") {
  //     event.target.loadVideoById({ videoId: this.video.id });
  //   }
  // }

  // // The API calls this function when the player's state changes.
  // onPlayerStateChange(event: { data: any }) {
  //   console.log(
  //     `[PlaylistPlayerPage] onPlayerStateChange(state: ${event.data})`
  //   );
  //   if (event.data == 0) {
  //     this.playNext();
  //   }
  // }
}
