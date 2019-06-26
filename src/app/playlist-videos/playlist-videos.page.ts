import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Playlist } from "../models/playlist";
import { Video } from "../models/video";
import { ModalController, LoadingController } from "@ionic/angular";
import { PlaylistsService } from "../services/playlists.service";

@Component({
  selector: "app-playlist-videos",
  templateUrl: "./playlist-videos.page.html",
  styleUrls: ["./playlist-videos.page.scss"]
})
export class PlaylistVideosPage implements OnInit {
  @Input()
  private playlist: Playlist;

  private myVideos: Video[] = [];

  constructor(
    private loadingController: LoadingController,
    private playlists: PlaylistsService,
    private modalCtrl: ModalController,
    private changes: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.playlist = this.clone(this.playlist);
    this.fetchPlaylistVideos();
  }

  fetchPlaylistVideos() {
    console.log("[PlaylistVideosPage] fetchPlaylistVideos()");
    this.loadingController
      .create({
        message: "Loading videos..."
      })
      .then(loading => {
        loading.present();
        this.playlists.listVideos(this.playlist.id).then(videos => {
          this.myVideos = videos;
          this.changes.detectChanges();
          loading.dismiss();
        });
      });
  }

  reorderVideos(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log("Before complete", this.myVideos);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the myVideos variable to the
    // new order of myVideos
    this.myVideos = ev.detail.complete(this.myVideos);

    // After complete is called the myVideos will be in the new order
    console.log("After complete", this.myVideos);

    this.playlists.updateVideos(this.playlist.id, this.myVideos);
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
    console.log("[PlaylistVideosPage] close()");
    this.modalCtrl.dismiss();
  }
}
