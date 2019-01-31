import { Component } from '@angular/core';
import { Card } from './classes/card';
import { Board } from './classes/board';
import { SortablejsOptions } from 'angular-sortablejs';
import { ElectronService } from 'ngx-electron';


import { MYBOARD, EMPTYBOARD } from './mocks/mock-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _electronService: ElectronService) { 
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

}
