import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BetoMainCanvasComponent } from './beto-main-canvas/beto-main-canvas.component';
import { ChatComponent } from './chat/chat.component';
import {RouterModule, Routes} from '@angular/router';


const appRoutes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'canvas', component: BetoMainCanvasComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    BetoMainCanvasComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }




