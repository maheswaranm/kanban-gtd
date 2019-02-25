import { Component, Input, NgZone } from '@angular/core';

import { Card } from './classes/card';
import { Board } from './classes/board';
import { Lane } from './classes/lane';

import { SortablejsOptions } from 'angular-sortablejs';

import { ElectronService } from 'ngx-electron';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CardDetailModalComponent } from './card-detail-modal/card-detail-modal.component'
import { NewCardModalComponent } from './new-card-modal/new-card-modal.component';
import { AddBoardModalComponent } from './add-board-modal/add-board-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private zone: NgZone, private _electronService: ElectronService, private modalService: NgbModal) { 
    this._electronService.ipcRenderer.send('load');
    this._electronService.ipcRenderer.on('update-board', (event, board) => {
      this.zone.run(
          () => {
              this.board = board;
              if(board != null) {
                this.sortAllCards(board)
              }
          }
        );

    });
  }

  title = 'Personal Kanban';
  board = null;
  

  normalOptions: SortablejsOptions = {
    group: 'normal-group',
    onEnd: (event: any) => {
      let oldPos = event.oldIndex+1;
      let newPos = event.newIndex+1;

      if(oldPos != newPos || (oldPos == newPos && event.from.id !=  event.to.id )) {
            this._electronService.ipcRenderer.send('updateBoard',event.from.id, oldPos , event.to.id, newPos );
      }
    }
  };

  showCardDetail(card: Card) {
    const cardDetailModalRef = this.modalService.open(CardDetailModalComponent);
    cardDetailModalRef.componentInstance.card = card;
  };


  showNewCardModal() {
    const cardDetailModelRef = this.modalService.open(NewCardModalComponent);
  }


  private sortAllCards(board:Board): Board {
      let newBoard = new Board();

      newBoard.id = board.id;
      newBoard.name = board.name;
      newBoard.lanes = [];

      for(let thislane in board.lanes) {
          let newLane = board.lanes[thislane];
          newLane.cards.sort((card1, card2) => card1.position - card2.position);

          newBoard.lanes.push(newLane);
      }

      return newBoard;
  }

  isBoardEmpty() {
    return this.board == null;
  }

  addBoardModal() {
    this.modalService.open(AddBoardModalComponent);
  }

}
