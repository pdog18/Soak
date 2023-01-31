const { app, BrowserWindow } = require('electron')
const path = require('path')
const ffi = require('ffi-napi');
 

const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 400,
        minHeight: 400,
        width: 800,
        height: 800,
        icon: path.join(__dirname, 'pdog.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index/index.html')

    // 打开开发工具
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    // 隐藏菜单栏
    const { Menu } = require('electron');
    Menu.setApplicationMenu(null);
    // hide menu for Mac 
    if (process.platform !== 'darwin') {
        app.dock.hide();
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})