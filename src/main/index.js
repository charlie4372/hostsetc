'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import {Messages} from "../common/messages";
import AppUpdater from './AppUpdater';

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createMainWindow() {
  const window = new BrowserWindow({webPreferences: {nodeIntegration: true}});
  let closing = false;

  if (isDevelopment) {
    window.webContents.openDevTools()
  // } else {
  //   // Needed to use dev tools while running in escalated mode (Windows 10)
  //   // https://github.com/electron/electron/issues/20069
  //   const devtools = new BrowserWindow()
  //   window.webContents.setDevToolsWebContents(devtools.webContents)
  //   window.webContents.openDevTools({ mode: 'detach' })
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  window.on('close', function(e) {
    // Send the renderer a request to prompt the user to confirm quitting.
    // When closing is true, (set below) then  we want to exit.
    if (closing) {
      return;
    }

    window.webContents.send(Messages.promptQuit);
    // This prevents the window from closing.
    e.preventDefault();
  });

  // When we hear the quit message, close the app.
  ipcMain.on(Messages.quit, (event) => {
    if (event.sender === window.webContents) {
      // Setting closing to true tells the on('close') to let the app close.
      closing = true;
      window.close();
    }
  });

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  mainWindow = createMainWindow()

  const updater = new AppUpdater();
  await updater.checkForUpdatesAndNotify();
})
