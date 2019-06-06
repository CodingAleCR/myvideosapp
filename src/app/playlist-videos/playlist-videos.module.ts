import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaylistVideosPage } from './playlist-videos.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistVideosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaylistVideosPage]
})
export class PlaylistVideosPageModule {}
