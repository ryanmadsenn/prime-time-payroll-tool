// eslint-disable-next-line
const fs = require("fs");
// eslint-disable-next-line
const { app, BrowserWindow, screen, ipcMain } = require("electron");
// eslint-disable-next-line
const XLSX = require("sheetjs-style");
// eslint-disable-next-line
const path = require("path");
// eslint-disable-next-line
const isDev = require("electron-is-dev");
// eslint-disable-next-line
const dotenv = require("dotenv");
dotenv.config();
const isMac = process.platform === "darwin";
const appData = app.getPath("appData");

const getApiKey = () => {
  if (fs.existsSync(`${appData}/PrimeTimeTool/config.json`)) {
    const config = JSON.parse(
      fs.readFileSync(`${appData}/PrimeTimeTool/config.json`, "utf8")
    );
    return config.apiKey;
  } else {
    fs.mkdirSync(`${appData}/PrimeTimeTool`);
    fs.writeFileSync(
      `${appData}/PrimeTimeTool/config.json`,
      JSON.stringify({ apiKey: "" })
    );
    return undefined;
  }
};

const updateApiKey = (apiKey) => {
  try {
    fs.writeFileSync(
      `${appData}/PrimeTimeTool/config.json`,
      JSON.stringify({ apiKey })
    );
    return true;
  } catch (err) {
    return false;
  }
};

const createMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    title: "Prime Time Tool",
    width: width,
    height: height,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      // contextIsolation: false,
    },
  });

  // mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (isMac) {
    app.quit();
  }
});

ipcMain.handle("getApiKey", () => getApiKey());
ipcMain.handle("updateApiKey", (_, apiKey) => updateApiKey(apiKey));
ipcMain.handle("closeWindow", () => app.quit());
ipcMain.handle("minimizeWindow", () =>
  BrowserWindow.getFocusedWindow().minimize()
);
ipcMain.handle("maximizeWindow", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow.isMaximized()) {
    focusedWindow.unmaximize();
  } else {
    focusedWindow.maximize();
  }
});
ipcMain.handle("isMac", () => isMac);
