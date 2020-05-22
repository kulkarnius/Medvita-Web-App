console.log('main process working');
console.log('main.js');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let winOne, winTwo; 

async function createWindow() {

    //Create the browser window.
    winOne = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true //this is has to be revisited for security purposes, should be set false in future
        }
    });

    winTwo = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true //this is has to be revisited for security purposes, should be set false in future
        }
    });

    // Load URL for app
    winOne.loadURL(url.format({
        pathname: path.join(__dirname, 'one.html'),
        protocol: 'file',
        slashes: true
    }));

    winTwo.loadURL(url.format({
        pathname: path.join(__dirname, 'two.html'),
        protocol: 'file',
        slashes: true
    }));

    //opens Dev Tools
    winOne.webContents.openDevTools();
    winTwo.webContents.openDevTools();

    winOne.on('closed', () => {
        win = null;
    })

    winTwo.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

//a bit of extra code for app to work on Mac
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