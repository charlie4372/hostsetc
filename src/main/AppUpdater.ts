import {autoUpdater, UpdateCheckResult} from "electron-updater"

export default class AppUpdater {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()

    autoUpdater.on('checking-for-update', () => {
      debugger;
    });

    autoUpdater.on('update-available', () => {
      debugger;
    });

    autoUpdater.on('update-not-available', () => {
      debugger;
    });
  }

  public checkForUpdates(): Promise<UpdateCheckResult | null> {
    return autoUpdater.checkForUpdatesAndNotify();
  }
}
