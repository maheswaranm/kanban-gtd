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

const args = process.argv.slice(1);
let serve = args.some(val => val === '--serve');
let filepath = app.getPath('appData')+'/kanban.json'


function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 })

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`../node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools()
  } else {
    win.loadFile('./dist/index.html')
  } 


  createConnection().then(async connection => {
    let boardRepo = connection.getRepository(Board);
    let laneRepo = connection.getRepository(Lane);

    let board = await boardRepo.findOne(1);

    let laneBacklog = await laneRepo.findOne({ name:"Backlog" });
    let laneDoing = await laneRepo.findOne({ name:"Doing" });
    let laneDone = await laneRepo.findOne({ name:"Done" });

    const boards = await connection.manager.find(Board);
    console.log("Loaded boards: ", boards);

    const lanes = await connection.manager.find(Lane);
    console.log("Loaded lanes: ", lanes);


    const cards = await connection.manager.find(Card);
    console.log("Loaded cards: ", cards);
}).catch(error => console.log(error));


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

ipcMain.on('update', (event, arg) => {
  fs.writeFile(filepath, JSON.stringify(arg), (err)=>{
    if(err) throw err;
  });

  event.returnValue = 'done'
});

ipcMain.on('load', (event) => {
  event.returnValue = fs.readFileSync(filepath, 'utf8');
});

ipcMain.on('updateCard', (event, arg) => {
  let cardid = arg.id;
  let cardobj = arg;

  console.log("have to update "+cardid);
  event.returnValue = 'done'
});

ipcMain.on('addCard', (event, arg) => {
  let cardtext = arg;

  let dbservice = new DBService();
  dbservice.addCard(1, cardtext); // default add to backlog for test
 
  event.returnValue = 'done'
});

