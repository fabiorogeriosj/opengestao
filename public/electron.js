const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')
var mysql = require('mysql')
var util = require('util')

let mainWindow

let pool

ipcMain.on('database-exec-connect', async (event, arg) => {
  pool = mysql.createPool({
    connectionLimit: 100,
    host: arg.host,
    user: arg.user,
    password: arg.password,
    database: arg.dbname,
    port: arg.port
  })
  pool.query = util.promisify(pool.query)
  try {
    const result = await pool.query('show tables')
    event.returnValue = { data: result }
  } catch (error) {
    event.returnValue = { error }
  }
})

ipcMain.on('database-exec-query', async (event, { query, params }) => {
  try {
    var result = await pool.query(query, params || [])
    event.returnValue = { data: result }
  } catch (error) {
    event.returnValue = { error }
  }
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    title: 'Open Gestão',
    center: true,
    focusable: true,
    minWidth: 880,
    autoHideMenuBar: true,
    show: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    height: 860,
    width: 1280
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`)
      })
      .catch(err => {
        console.log('An error occurred: ', err)
      })

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`)
      })
      .catch(err => {
        console.log('An error occurred: ', err)
      })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg)
    })
  })
}

const generateMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [{ role: 'about' }, { role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      role: 'help',
      submenu: [
        {
          click () {
            require('electron').shell.openExternal(
              'https://getstream.io/winds'
            )
          },
          label: 'Learn More'
        },
        {
          click () {
            require('electron').shell.openExternal(
              'https://github.com/GetStream/Winds/issues'
            )
          },
          label: 'File Issue on GitHub'
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', () => {
  createWindow()
  generateMenu()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg)
})
