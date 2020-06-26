const electron = require('electron');
const ipc = electron.ipcRenderer;

window.exitApp = function () {
    ipc.send('close-me')
}

window.UserPassError = function () {
    ipc.send('userpass-error-dialog')
}

window.PassNoMatchError = function () {
    ipc.send('passnomatch-error-dialog')
}

window.DatabaseError = function () {
    ipc.send('database-error-dialog')
}

window.AccountCreationError = function () {
    ipc.send('account-not-created-dialog')
}

//note to self: figure out how to incorporate contextisolation without screwing the whole thing over