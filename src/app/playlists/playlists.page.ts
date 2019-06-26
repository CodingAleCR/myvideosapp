import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { PlaylistsService } from "../services/playlists.service";
import { Playlist } from "../models/playlist";
import {
  ActionSheetController,
  ModalController,
  AlertController,
  ToastController,
  LoadingController
} from "@ionic/angular";
import { PlaylistEditorPage } from "../playlist-editor/playlist-editor.page";
import { OverlayEventDetail } from "@ionic/core";
import { PlaylistVideosPage } from "../playlist-videos/playlist-videos.page";
import { PlaylistPlayerPage } from "../playlist-player/playlist-player.page";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.page.html",
  styleUrls: ["./playlists.page.scss"]
})
export class PlaylistsPage implements OnInit {
  private myPlaylists: Playlist[];

  constructor(
    private loadingController: LoadingController,
    private playlists: PlaylistsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private changes: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  public ionViewWillEnter(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists() {
    console.log("[PlaylistsPage] fetchPlaylists()");
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

  addPlaylist() {
    console.log(`[PlaylistsPage] addPlaylist()`);
    let playlist: Playlist = {
      title: "",
      description: "",
      thumbnail: null,
      date: Date.now(),
      count: 0
    };
    this.modalCtrl
      .create({
        component: PlaylistEditorPage,
        componentProps: { mode: "add", playlist: playlist }
      })
      .then(modal => {
        modal.onDidDismiss().then((evt: OverlayEventDetail) => {
          if (evt && evt.data) {
            this.loadingController
              .create({
                message: "Adding playlist..."
              })
              .then(loading => {
                loading.present();
                this.playlists.addPlaylist(evt.data).then(() => {
                  loading.dismiss();
                  this.fetchPlaylists();
                });
              });
          }
        });
        modal.present();
      });
  }

  showMenu(playlist) {
    this.actionSheetCtrl
      .create({
        buttons: [
          {
            text: "Open",
            icon: "folder-open",
            handler: () => {
              console.log("Open playlist!!");
              this.openPlaylist(playlist);
            }
          },
          {
            text: "Play",
            icon: "play",
            handler: () => {
              console.log("Play playlist!!");
              this.playPlaylist(playlist);
            }
          },
          {
            text: "Edit",
            icon: "create",
            handler: () => {
              console.log("Edit playlist!!");
              this.editPlaylist(playlist);
            }
          },
          {
            text: "Delete",
            icon: "trash",
            handler: () => {
              console.log("Delete playlist!!");
              this.deletePlaylist(playlist);
            }
          }
        ]
      })
      .then(actionSheet => actionSheet.present());
  }

  async playPlaylist(playlist: Playlist) {
    console.log(`[PlaylistsPage] playPlaylist(${playlist.id})`);
    if (playlist.count > 0) {
      this.modalCtrl
        .create({
          component: PlaylistPlayerPage,
          componentProps: { playlist: playlist }
        })
        .then(modal => {
          modal.present();
        });
    } else {
      const toast = await this.toastCtrl.create({
        message: `There are no videos in this playlist, add one first.`,
        duration: 2000,
        showCloseButton: true
      });
      toast.present();
    }
  }

  async openPlaylist(playlist: Playlist) {
    console.log(`[PlaylistsPage] openPlaylist(${playlist.id})`);
    if (playlist.count > 0) {
      this.modalCtrl
        .create({
          component: PlaylistVideosPage,
          componentProps: { playlist: playlist }
        })
        .then(modal => {
          modal.present();
        });
    } else {
      const toast = await this.toastCtrl.create({
        message: `There are no videos in this playlist, add one first.`,
        duration: 2000,
        showCloseButton: true
      });
      toast.present();
    }
  }

  editPlaylist(playlist: Playlist) {
    console.log(`[PlaylistsPage] editPlaylist(${playlist.id})`);
    this.modalCtrl
      .create({
        component: PlaylistEditorPage,
        componentProps: { mode: "edit", playlist: playlist }
      })
      .then(modal => {
        modal.onDidDismiss().then((evt: OverlayEventDetail) => {
          if (evt && evt.data) {
            this.playlists
              .updatePlaylist(evt.data)
              .then(() => this.fetchPlaylists());
          }
        });
        modal.present();
      });
  }

  deletePlaylist(playlist: Playlist) {
    console.log(`[PlaylistsPage] deletePlaylist(${playlist.id})`);
    this.alertCtrl
      .create({
        header: "Delete playlist",
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
              this.playlists
                .removePlaylist(playlist.id)
                .then(() => this.fetchPlaylists());
            }
          }
        ]
      })
      .then(alert => alert.present());
  }
}
