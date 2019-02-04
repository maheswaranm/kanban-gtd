import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { Card } from './classes/card';
import { Board } from './classes/board';

import { SortablejsOptions } from 'angular-sortablejs';

import { ElectronService } from 'ngx-electron';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CardDetailModalComponent } from './card-detail-modal/card-detail-modal.component'
import { NewCardModalComponent } from './new-card-modal/new-card-modal.component';

import { MYBOARD, EMPTYBOARD } from './mocks/mock-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( private _electronService: ElectronService, private modalService: NgbModal, private ref: ChangeDetectorRef) { 
    this._electronService.ipcRenderer.send('load');
    this._electronService.ipcRenderer.on('update-board', (event, board) => {
      console.log(board);
      this.board = board;
      this.ref.detectChanges(); 
    });
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

  }

  showCardDetail(card: Card) {
    console.log('click');
    const cardDetailModalRef = this.modalService.open(CardDetailModalComponent);
    cardDetailModalRef.componentInstance.card = card;
    console.log('done');

    console.log('here-->'+this.modalService.hasOpenModals())
  };


  showNewCardModal() {
    const cardDetailModelRef = this.modalService.open(NewCardModalComponent);
  }
  }

}
