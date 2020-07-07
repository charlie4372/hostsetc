import {autoUpdater, UpdateCheckResult} from "electron-updater"

export default class AppUpdater {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log
  }

  public checkForUpdatesAndNotify(): Promise<UpdateCheckResult | null> {
    return autoUpdater.checkForUpdatesAndNotify();
  }
}
