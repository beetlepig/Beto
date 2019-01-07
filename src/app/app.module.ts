import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';

import {environment} from '../environments/environment';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {RouterModule, Routes} from '@angular/router';
import { InformationSectionComponent } from './information-section/information-section.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { GridComponent } from './grid/grid.component';
import { DropdownMenuComponent } from './menu/dropdown-menu/dropdown-menu.component';
import { MiniMenuComponent } from './mini-menu/mini-menu.component';
import { AboutAlexComponent } from './about-alex/about-alex.component';
import { AlexLogoComponent } from './alex-logo/alex-logo.component';
import { ContactoComponent } from './contacto/contacto.component';
import {FormsModule} from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { TextoCitasComponent } from './texto-citas/texto-citas.component';
import { TeamComponent } from './team/team.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import {ImagesProviderService} from './images-provider.service';
import {HttpClientModule} from '@angular/common/http';



const appRoutes: Routes = [
  { path: '', pathMatch: 'full' , component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'information', component: InformationSectionComponent },
  { path: 'Alex', component: AboutAlexComponent },
  { path: 'Team', component: TeamComponent },
  { path: 'Contact', component: ContactoComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'Evaluate', component: EvaluateComponent },
  { path: '**', component: HomeComponent }
];

export function imagesFactory(provider: ImagesProviderService) {
  return () => provider.load();
}


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InformationSectionComponent,
    MenuComponent,
    HomeComponent,
    GridComponent,
    DropdownMenuComponent,
    MiniMenuComponent,
    AboutAlexComponent,
    AlexLogoComponent,
    ContactoComponent,
    AdminComponent,
    TextoCitasComponent,
    TeamComponent,
    EvaluateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [
    ImagesProviderService,
    { provide: APP_INITIALIZER, useFactory: imagesFactory, deps: [ImagesProviderService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




