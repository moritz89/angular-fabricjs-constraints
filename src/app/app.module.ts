import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FloorPlannerComponent } from './floor-planner/floor-planner.component';

@NgModule({
  declarations: [
    AppComponent,
    FloorPlannerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
