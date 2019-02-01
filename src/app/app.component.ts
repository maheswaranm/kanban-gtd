import { Component, Input } from '@angular/core';

import { Card } from './classes/card';
import { Board } from './classes/board';

import { SortablejsOptions } from 'angular-sortablejs';

import { ElectronService } from 'ngx-electron';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { MYBOARD, EMPTYBOARD } from './mocks/mock-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _electronService: ElectronService, private modalService: NgbModal) { 
    this.board = JSON.parse(this._electronService.ipcRenderer.sendSync('load',123)); 
  }

  title = 'personal-kanban-electron';
  board = EMPTYBOARD;
  

  normalOptions: SortablejsOptions = {
    group: 'normal-group',
    onEnd: (event: any) => {
      console.log('from ' + event.from.id + ' at ' + event.oldIndex + ' to ' + event.to.id + ' at ' + event.newIndex );

      if(this._electronService.isElectronApp) {
            let updateresult: string = this._electronService.ipcRenderer.sendSync('update',this.board);
      }
    }
  };


  showCardDetail(content:any, card: Card): void {
    const cardDetailModelRef = this.modalService.open(NgbdModalContent);
    cardDetailModelRef.componentInstance.card = card;
  }

}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Card Details</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div>
            {{ card.text }}
        </div>
    </div>
  `
})
export class NgbdModalContent {
  @Input() card: Card;

  constructor(public activeModal: NgbActiveModal) {}
}


