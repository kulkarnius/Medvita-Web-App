const electron = require('electron');
const ipc = electron.ipcRenderer;

const exitApp = document.getElementById('exitApp')

exitApp.addEventListener('click', function() {
    ipc.send('close-me')
})