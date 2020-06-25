const electron = require('electron');
const ipc = electron.ipcRenderer;

window.exitApp = function(){
    ipc.send('close-me')
}


//note to self: figure out how to incorporate contextisolation without screwing the whole thing over