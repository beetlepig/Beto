import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {RouterModule, Routes} from '@angular/router';
import { InformationSectionComponent } from './information-section/information-section.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';



const appRoutes: Routes = [
  { path: '', pathMatch: 'full' , component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'information', component: InformationSectionComponent },
  { path: '**', component: HomeComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InformationSectionComponent,
    MenuComponent,
    HomeComponent
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




