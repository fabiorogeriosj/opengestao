const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote

window.db = {}
window.db.messageDbNotFound = 'Banco de dados não configurado!'

const getConnection = () => {
  return {
    host: window.localStorage.getItem('database-host'),
    user: window.localStorage.getItem('database-user'),
    password: window.localStorage.getItem('database-password'),
    dbname: window.localStorage.getItem('database-dbname'),
    port: window.localStorage.getItem('database-port')
  }
}

window.db.connect = () => {
  return new Promise((resolve, reject) => {
    if (!getConnection().host) return reject(window.db.messageDbNotFound)

    const res = ipcRenderer.sendSync('database-exec-connect', getConnection())
    if (res && res.error && res.error.code === 'ENOENT') return reject(window.db.messageDbNotFound)
    if (res && res.error && res.error.sqlMessage) return reject(res.error.sqlMessage)
    if (res && res.data) return resolve(res.data)
    if (!res) return reject(window.db.messageDbNotFound)
    if (res && res.error && res.error.code) return reject(res.error.code)
  })
}

window.db.query = (query, params = []) => {
  return new Promise((resolve, reject) => {
    if (!getConnection().host) return reject(window.db.messageDbNotFound)

    const res = ipcRenderer.sendSync('database-exec-query', { query, params })
    if (res && res.error && res.error.code === 'ENOENT') return reject(window.db.messageDbNotFound)
    if (res && res.error && res.error.sqlMessage) return reject(res.error.sqlMessage)
    if (res && res.data) return resolve(res.data)
    if (!res) return reject(window.db.messageDbNotFound)
  })
}

window.alert = {
  error: msg => setTimeout(() => dialog.showErrorBox('Atenção', msg), 200),
  success: msg => setTimeout(() => dialog.showMessageBox({ title: 'Sucesso', message: msg, type: 'info', buttons: ['OK'] }), 200)
}
