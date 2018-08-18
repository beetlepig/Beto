import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BetoMainCanvasComponent } from './beto-main-canvas/beto-main-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    BetoMainCanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
