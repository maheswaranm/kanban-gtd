import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { SortablejsModule } from 'angular-sortablejs'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxElectronModule } from 'ngx-electron';


import { AppComponent,NgbdModalContent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    NgbdModalContent
  ],
  entryComponents: [
      NgbdModalContent
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
