import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "videos",
        loadChildren: "../my-videos/my-videos.module#MyVideosPageModule"
      },
      {
        path: "youtube",
        loadChildren:
          "../youtube-videos/youtube-videos.module#YoutubeVideosPageModule"
      },
      {
        path: "playlists",
        loadChildren: "../playlists/playlists.module#PlaylistsPageModule"
      },
      {
        path: "",
        redirectTo: "/tabs/videos",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
