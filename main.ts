import "reflect-metadata";
import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as fs from 'fs';
import {createConnection} from "typeorm";
import { User } from "./data/entity/User";
import { Board } from "./data/entity/board";
import { Lane } from "./data/entity/lane";
import { Card } from "./data/entity/card";

import { DBService } from "./data/service/db-service";

let win

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const args = process.argv.slice(1);
let serve = args.some(val => val === '--serve');
let filepath = app.getPath('appData')+'/kanban.json'
let dbservice = new DBService();


function createWindow () {
  win = new BrowserWindow({ titleBarStyle: 'hidden', frame:false, width: 800, 
    height: 600, minWidth: 800, minHeight: 600 })

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`../node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools()
  } else {
    win.loadFile(__dirname+'/index.html')
  } 


  createConnection({
   "type": "sqlite",
   "database": app.getPath('userData')+"/database.sqlite",
   "synchronize": true,
   "logging": false,
   "entities": [
       "./dist/data/entity/*.js",
       __dirname+"/data/entity/*.js"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "data/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
});


  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('updateBoard', (event, fromLaneId, oldPos, toLaneId, newPos) => {
  dbservice.updateBoard(fromLaneId, oldPos, toLaneId, newPos).then(
    () => {
      dbservice.getBoard(1).then(board => {
        event.sender.send('update-board',board);
      });
    }
    );
});

ipcMain.on('load', (event) => {
  dbservice.getBoard(1).then(board => {
    event.sender.send('update-board', board)
  });
});

ipcMain.on('updateCard', (event, card) => {
  dbservice.updateCard(card.id, card.text);

  event.returnValue = 'done'
});

ipcMain.on('addCard', (event, cardtext) => {
  dbservice.addCard(1, cardtext).then(
    () => {
      dbservice.getBoard(1).then(board => {
        event.sender.send('update-board',board);
      });
    }

    ); // default add to backlog for test
});

ipcMain.on('addBoard', (event, boardname, lanenames) => {
  dbservice.addBoard(boardname, lanenames).then(
    () => {
      dbservice.getBoard(1).then(board => {
        event.sender.send('update-board',board);
      });
    }
    );
});

