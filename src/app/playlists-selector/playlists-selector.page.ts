import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import {
  ModalController,
  ToastController,
  LoadingController
} from "@ionic/angular";
import { Playlist } from "../models/playlist";
import { PlaylistsService } from "../services/playlists.service";
import { Video } from "../models/video";

@Component({
  selector: "app-playlists-selector",
  templateUrl: "./playlists-selector.page.html",
  styleUrls: ["./playlists-selector.page.scss"]
})
export class PlaylistsSelectorPage implements OnInit {
  private myPlaylists: Playlist[];

  @Input()
  private video: Video;

  constructor(
    private loadingController: LoadingController,
    private playlists: PlaylistsService,
    private modalCtrl: ModalController,
    private changes: ChangeDetectorRef,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.fetchPlaylists();
  }

  fetchPlaylists() {
    console.log("[PlaylistsSelectorPage] fetchPlaylists()");
    this.loadingController
      .create({
        message: "Loading playlists..."
      })
      .then(loading => {
        loading.present();
        this.playlists.findPlaylists().then(playlists => {
          this.myPlaylists = playlists;
          this.changes.detectChanges();
          loading.dismiss();
        });
      });
  }

  addToPlaylist(playlist: Playlist) {
    console.log(`[PlaylistsSelectorPage] addToPlaylist(${playlist.id})`);
    this.loadingController
      .create({
        message: `Adding video to ${playlist.title}...`
      })
      .then(loading => {
        loading.present();
        this.playlists
          .addVideo(playlist.id, this.video)
          .then(_ => {
            loading.dismiss();
            this.changes.detectChanges();
            this.showSuccessToast(playlist.title);
          })
          .catch(error => {
            loading.dismiss();
            console.log(`[PlaylistsSelectorPage] ${error}`);
          });
      });
  }

  async showSuccessToast(playlistTitle) {
    const toast = await this.toastCtrl.create({
      color: "success",
      message: `🎉 Video added to the playlist ${playlistTitle}`,
      duration: 2000,
      showCloseButton: true
    });
    toast.present();

    this.close();
  }

  close() {
    console.log("[PlaylistsSelectorPage] close()");
    this.modalCtrl.dismiss();
  }
}
