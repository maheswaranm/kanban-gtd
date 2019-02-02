import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { SortablejsModule } from 'angular-sortablejs'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxElectronModule } from 'ngx-electron';


import { AppComponent } from './app.component';
import { CardDetailModalComponent } from './card-detail-modal/card-detail-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CardDetailModalComponent
  ],
  entryComponents: [
     CardDetailModalComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    SortablejsModule.forRoot({ animation: 150 }),
    NgbModule,
    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
