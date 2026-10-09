const path = require('node:path')
const { app, BrowserWindow, session, shell } = require('electron')
const { removeEmbeddingHeaders } = require('./frame-headers.cjs')

const appUrl = 'http://127.0.0.1:3000'
const appOrigin = new URL(appUrl).origin

function isExternalWebsite(address) {
  try {
    const url = new URL(address)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== appOrigin
  } catch {
    return false
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: '远航浏览器',
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  })

  window.webContents.on('will-navigate', (event, address) => {
    if (new URL(address).origin !== appOrigin) event.preventDefault()
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalWebsite(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })

  void window.loadURL(appUrl)
}

app.whenReady().then(() => {
  const browserSession = session.defaultSession

  browserSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false))
  browserSession.setPermissionCheckHandler(() => false)

  browserSession.webRequest.onHeadersReceived(
    { urls: ['http://*/*', 'https://*/*'] },
    (details, callback) => {
      if (details.resourceType !== 'subFrame' || !isExternalWebsite(details.url) || !details.responseHeaders) {
        callback({})
        return
      }

      callback({ responseHeaders: removeEmbeddingHeaders(details.responseHeaders) })
    },
  )

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
