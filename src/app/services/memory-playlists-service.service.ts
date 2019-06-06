import { Injectable } from "@angular/core";
import { PlaylistsService } from "./playlists.service";
import { Playlist } from "../models/playlist";
import { Video } from "../models/video";
import { YoutubeVideosService } from "./youtube-videos.service";
import { VideosService } from "./videos.service";

@Injectable({
  providedIn: "root"
})
export class MemoryPlaylistsService extends PlaylistsService {
  private playlists: Playlist[] = [];
  private playlistVideos: { playlistId: string; videos: string[] }[] = [];
  private nextId = 0;

  constructor(
    private youtubeService: YoutubeVideosService,
    private memoryService: VideosService
  ) {
    super();
  }

  findPlaylists(): Promise<Playlist[]> {
    return new Promise((resolve, reject) => {
      let _playlists = this.playlists.map(playlist => this.clone(playlist));
      resolve(_playlists);
    });
  }

  addPlaylist(playlist: Playlist): Promise<Playlist> {
    console.log(
      "[MemoryPlaylistsService] addPlaylist(" + JSON.stringify(playlist) + ")"
    );
    let _playlist = this.clone(playlist);
    _playlist.id = String(this.nextId++);
    this.playlists.push(_playlist);
    return new Promise((resolve, reject) => resolve(this.clone(_playlist)));
  }

  removePlaylist(playlistId: string): Promise<void> {
    console.log(`[MemoryPlaylistsService] removePlaylist(${playlistId})`);
    var index = this.playlists.findIndex(
      playlist => playlist.id === playlistId
    );
    if (index !== -1) {
      this.playlists.splice(index, 1);
      return new Promise((resolve, reject) => resolve());
    } else {
      return new Promise((resolve, reject) =>
        reject(new Error(`Playlist with id ${playlistId} not found`))
      );
    }
  }

  updatePlaylist(playlist: Playlist): Promise<Playlist> {
    console.log(
      "[MemoryPlaylistsService] updatePlaylist(" +
        JSON.stringify(playlist) +
        ")"
    );
    var index = this.playlists.findIndex(
      _playlist => _playlist.id === playlist.id
    );
    if (index !== -1) {
      this.playlists[index] = this.clone(playlist);
      return new Promise((resolve, reject) => resolve(this.clone(playlist)));
    } else {
      return new Promise((resolve, reject) =>
        reject(new Error(`Playlist with id ${playlist.id} not found`))
      );
    }
  }

  addVideo(playlistId: string, video: Video): Promise<void> {
    console.log(
      `[MemoryPlaylistsService] addVideo(${JSON.stringify(playlistId)}, ${
        video.id
      })`
    );
    var index = this.playlists.findIndex(
      _playlist => _playlist.id === playlistId
    );
    if (index !== -1) {
      this.playlists[index].count += 1;
      var pIndex = this.playlistVideos.findIndex(
        _playlist => _playlist.playlistId === playlistId
      );
      if (pIndex !== -1) {
        this.playlistVideos[pIndex].videos.push(video.id);
      } else {
        this.playlistVideos.push({
          playlistId: playlistId,
          videos: [video.id]
        });
      }
      return new Promise((resolve, reject) => resolve());
    } else {
      return new Promise((resolve, reject) =>
        reject(new Error(`Playlist with id ${playlistId} not found`))
      );
    }
  }

  removeVideo(playlistId: string, videoId: string): Promise<void> {
    console.log(
      "[MemoryPlaylistsService] removeVideo(" +
        JSON.stringify(playlistId) +
        ", " +
        videoId +
        ")"
    );
    var index = this.playlists.findIndex(
      _playlist => _playlist.id === playlistId
    );
    if (index !== -1) {
      this.playlists[index].count -= 1;
      var pIndex = this.playlistVideos.findIndex(
        _playlist => _playlist.playlistId === playlistId
      );
      if (pIndex !== -1) {
        var vIndex = this.playlistVideos[pIndex].videos.findIndex(
          _videoId => _videoId === videoId
        );
        if (vIndex !== -1) {
          this.playlistVideos[pIndex].videos.splice(vIndex, 1);
          return new Promise((resolve, reject) => resolve());
        } else {
          return new Promise((resolve, reject) =>
            reject(
              new Error(
                `Video with id ${videoId} not found in playlist ${playlistId}`
              )
            )
          );
        }
      } else {
        return new Promise((resolve, reject) =>
          reject(
            new Error(`Playlist with id ${playlistId} does not have any videos`)
          )
        );
      }
    } else {
      return new Promise((resolve, reject) =>
        reject(new Error(`Playlist with id ${playlistId} not found`))
      );
    }
  }

  async listVideos(playlistId: string): Promise<Video[]> {
    console.log(
      `[MemoryPlaylistsService] listVideos(${JSON.stringify(playlistId)})`
    );
    var index = this.playlists.findIndex(
      _playlist => _playlist.id === playlistId
    );
    if (index !== -1) {
      var pIndex = this.playlistVideos.findIndex(
        _playlist => _playlist.playlistId === playlistId
      );
      let _videos: Video[] = [];
      if (pIndex !== -1) {
        for (const videoId of this.playlistVideos[pIndex].videos) {
          var video: Video = await this.memoryService.findVideoById(videoId);
          if (!video) {
            console.log(`[MemoryPlaylistsService] youtube video)`);
            video = await this.youtubeService.findVideoById(videoId);
          }
          _videos.push(video);
        }
      }
      return _videos;
    } else {
      throw new Error(`Playlist with id ${playlistId} not found`);
    }
  }

  updateVideos(playlistId: string, videos: Video[]): Promise<Video[]> {
    console.log(
      `[MemoryPlaylistsService] updateVideos(${JSON.stringify(playlistId)})`
    );
    var index = this.playlists.findIndex(
      _playlist => _playlist.id === playlistId
    );
    if (index !== -1) {
      var pIndex = this.playlistVideos.findIndex(
        _playlist => _playlist.playlistId === playlistId
      );

      if (pIndex !== -1) {
        var videoIds: string[] = [];
        for (const video of videos) {
          videoIds.push(video.id);
        }
        this.playlistVideos[pIndex].videos = videoIds;
      }

      return new Promise((resolve, reject) => resolve(videos));
    } else {
      return new Promise((resolve, reject) =>
        reject(new Error(`Playlist with id ${playlistId} not found`))
      );
    }
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
}
