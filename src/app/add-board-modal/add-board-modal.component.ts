import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-add-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.css']
})
export class AddBoardModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private _electronService: ElectronService) {
  	this.numbers = Array(this.count).fill('').map((x,i) => i);
  }

  ngOnInit() {
  }

  count = 3;
  numbers;

  increaseLaneCount() {
  	this.count += 1;
  	this.numbers = Array(this.count).fill('').map((x,i) => i);
  }

  decreaseLaneCount() {
  	if(this.count > 1) {
	 	this.count -= 1;
  		this.numbers = Array(this.count).fill('').map((x,i) => i);
  	}
  }

  createBoard(modalForm: any) {
  	let boardname = modalForm.value.boardname;
  	let lanenames = [];
  	let lane:any;
  	for(lane in modalForm.value.lanes) {
  		lanenames.push(modalForm.value.lanes[lane]);
  	}

  	this._electronService.ipcRenderer.send('addBoard', boardname, lanenames);

  }

}
