import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { YoutubeVideosPage } from './youtube-videos.page';

const routes: Routes = [
  {
    path: '',
    component: YoutubeVideosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [YoutubeVideosPage]
})
export class YoutubeVideosPageModule {}
