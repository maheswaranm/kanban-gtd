import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as fs from 'fs';

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

ipcMain.on('load', (event, arg) => {
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
 
  console.log("have to add new card "+cardtext);
  event.returnValue = 'done'
});

