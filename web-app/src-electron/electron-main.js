import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import os from "os";
import { initialize, enable } from "@electron/remote/main";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

initialize();
// Initialize database connection
let db;

async function initializeDatabase() {
  db = await open({
    filename: path.join(app.getPath("userData"), "database.sqlite"),
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
  `);
}

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1400,
    height: 800,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function setupIpcHandlers() {
  ipcMain.handle("getAllUsers", async () => {
    return await db.all("SELECT * FROM users");
  });
  ipcMain.handle("createUser", async (userData) => {
    const { name, email, role } = JSON.parse(userData);
    // console.log('userData received in main process:', event);
    console.log("name", name);
    return { name, email, role };
    // const result = await db.run(
    //   'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
    //   [name, email, role]
    // );
    return {
      id: 1,
      name: "John",
      email: "john@doe.com",
      role: "user",
    };
  });
}

app.whenReady().then(async () => {
  await initializeDatabase();
  setupIpcHandlers();
  createWindow();
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
