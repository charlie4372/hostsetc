import autoUpdater from "update-electron-app";

autoUpdater({
  repo: 'charlie4372/hosts-etc',
  updateInterval: '1 hour',
  logger: require('electron-log')
})
