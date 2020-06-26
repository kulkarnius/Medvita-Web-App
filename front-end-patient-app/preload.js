const electron = require('electron');
const ipc = electron.ipcRenderer;

window.exitApp = function(){
    ipc.send('close-me')
}

window.ErrorBox = function(){
    ipc.send('open-error-dialog')
}

//note to self: figure out how to incorporate contextisolation without screwing the whole thing over