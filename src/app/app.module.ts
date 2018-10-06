import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BetoMainCanvasComponent } from './beto-main-canvas/beto-main-canvas.component';
import { ChatComponent } from './chat/chat.component';
import {RouterModule, Routes} from '@angular/router';
import { InformationSectionComponent } from './information-section/information-section.component';
import { MenuComponent } from './menu/menu.component';



const appRoutes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'canvas', component: BetoMainCanvasComponent },
  { path: 'information', component: InformationSectionComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    BetoMainCanvasComponent,
    ChatComponent,
    InformationSectionComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }




