console.log('main process working');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let parentWindow, childWindow;

function createWindow() {
    parentWindow = new BrowserWindow({
        title: 'MedTech', /*show: false,*/
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    childWindow = new BrowserWindow({
        parent: parentWindow, modal: true, title: 'Login-Screen',
        width: 400, maxWidth: 400, height: 525, maxHeight: 525, /*frame: false*/
    });
    /*childWindow.once('ready-to-show', () => {
        childWindow.show()
    });*/
    childWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }));

    parentWindow.on('closed', () => {
        win = null;
    })
}

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
