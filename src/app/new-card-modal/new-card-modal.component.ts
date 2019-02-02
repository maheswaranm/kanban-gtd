import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-new-card-modal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['./new-card-modal.component.css']
})
export class NewCardModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private _electronService: ElectronService) { }

  ngOnInit() {
  }

  addNewCard(modalForm: any) {
  	let text = modalForm.value.cardtext;
  	let updateresult: string = this._electronService.ipcRenderer.sendSync('addCard',text);
  }

}
