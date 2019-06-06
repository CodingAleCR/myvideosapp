import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'my-videos', loadChildren: './my-videos/my-videos.module#MyVideosPageModule' },
  { path: 'youtube-videos', loadChildren: './youtube-videos/youtube-videos.module#YoutubeVideosPageModule' },
  { path: 'playlists', loadChildren: './playlists/playlists.module#PlaylistsPageModule' },
  { path: 'video-editor', loadChildren: './video-editor/video-editor.module#VideoEditorPageModule' },
  { path: 'video-player', loadChildren: './video-player/video-player.module#VideoPlayerPageModule' },
  { path: 'playlist-editor', loadChildren: './playlist-editor/playlist-editor.module#PlaylistEditorPageModule' },
  { path: 'playlists-selector', loadChildren: './playlists-selector/playlists-selector.module#PlaylistsSelectorPageModule' },
  { path: 'playlist-videos', loadChildren: './playlist-videos/playlist-videos.module#PlaylistVideosPageModule' },
  { path: 'playlist-player', loadChildren: './playlist-player/playlist-player.module#PlaylistPlayerPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
