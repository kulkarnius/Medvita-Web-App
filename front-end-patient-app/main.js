//main.js is where essentially all of the backend for the application takes place
//to run program, type "npm start" into terminal

console.log('main process working');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;

let parentWindow, childWindow;

function createWindow() {
    parentWindow = new BrowserWindow({
        title: 'MedTech', /*show: false,*/
        webPreferences: {
            //nodeIntegration: true, //not secure
            //enableRemoteModule: true //not secure
        }
    });
    childWindow = new BrowserWindow({
        parent: parentWindow, /*modal: true,*/ title: 'Login-Screen',
        width: 400, maxWidth: 400, height: 525, maxHeight: 525, //frame: false,
        webPreferences: {
            //nodeIntegration: true, //not secure
            //enableRemoteModule: true, //not secure
            //contextIsolation: true, //protects against prototype pollution attacks, needs to be set eventually
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    });
    /*childWindow.once('ready-to-show', () => {
        childWindow.show()
    });*/
    parentWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'firebase.html'),
        protocol: 'file',
        slashes: true
    }));

    childWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }));

    parentWindow.on('closed', () => {
        win = null;
    })
}

ipc.on('close-me', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});