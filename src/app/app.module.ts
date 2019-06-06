import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Camera } from "@ionic-native/camera/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { VideoEditorPageModule } from "./video-editor/video-editor.module";
import { VideoPlayerPageModule } from "./video-player/video-player.module";

import { HttpClientModule } from "@angular/common/http";
import { MemoryVideosService } from "./services/memory-videos-service.service";
import { VideosService } from "./services/videos.service";
import { YoutubeVideosService } from "./services/youtube-videos.service";
import { PlaylistsService } from "./services/playlists.service";
import { MemoryPlaylistsService } from "./services/memory-playlists-service.service";
import { PlaylistEditorPageModule } from "./playlist-editor/playlist-editor.module";
import { PlaylistsSelectorPageModule } from "./playlists-selector/playlists-selector.module";
import { PlaylistVideosPageModule } from "./playlist-videos/playlist-videos.module";
import { PlaylistPlayerPageModule } from "./playlist-player/playlist-player.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    VideoEditorPageModule,
    VideoPlayerPageModule,
    PlaylistEditorPageModule,
    PlaylistsSelectorPageModule,
    PlaylistVideosPageModule,
    PlaylistPlayerPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: VideosService, useClass: MemoryVideosService },
    YoutubeVideosService,
    { provide: PlaylistsService, useClass: MemoryPlaylistsService },
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
