//main.js is where essentially all of the backend for the application takes place
//to run program, type "npm start" into terminal

console.log('main process working');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;

let win;

function createWindow() {
    win = new BrowserWindow({
        /*modal: true,*/ show: false, title: 'Login-Screen', 
        //width: 400, maxWidth: 400, height: 525, maxHeight: 525, //frame: false,
        webPreferences: {
            //nodeIntegration: true, //not secure
            //enableRemoteModule: true, //not secure
            //contextIsolation: true, //protects against prototype pollution attacks, needs to be set eventually
            preload: path.join(app.getAppPath(), 'preload.js'),
        }
    });
    win.maximize();
    win.once('ready-to-show', () => {
        win.show()
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'homescreen.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    })
}

ipc.on('close-me', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipc.on('userpass-error-dialog', function () {
    dialog.showErrorBox('Invalid Login', "Incorrect Username/Password")
})

ipc.on('passnomatch-error-dialog', function () {
    dialog.showErrorBox('Error', "Passwords don't match")
})

ipc.on('database-error-dialog', function () {
    dialog.showErrorBox('Error', "Data could not be stored in database")
})

ipc.on('account-not-created-dialog', function () {
    dialog.showErrorBox('Error', "Account could not be created")
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
