// eslint-disable-next-line
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on,
  },
});
