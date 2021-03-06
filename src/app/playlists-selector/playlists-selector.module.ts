import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PlaylistsSelectorPage } from "./playlists-selector.page";

const routes: Routes = [
  {
    path: "",
    component: PlaylistsSelectorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaylistsSelectorPage]
})
export class PlaylistsSelectorPageModule {}
