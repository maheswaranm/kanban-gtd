import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElectronService } from 'ngx-electron';

import { Card } from '../classes/card';

@Component({
  selector: 'app-card-detail-modal',
  templateUrl: './card-detail-modal.component.html',
  styleUrls: ['./card-detail-modal.component.css']
})
export class CardDetailModalComponent implements OnInit {

  @Input() card;	

  constructor(public activeModal: NgbActiveModal, private _electronService: ElectronService) { }

  ngOnInit() {
  }

  updateCard(card: Card, modalForm: any) {
    card.text = modalForm.value.cardtext;
    let updateresult: string = this._electronService.ipcRenderer.sendSync('updateCard', card);
  }

}
