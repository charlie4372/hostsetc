import fs from 'fs';

export class HostsFile {
  private _hostsFilePaths: string[] = [
    '%SYSTEM_ROOT%/system32/drivers/etc/hosts',
    '/etc/hosts'
  ]

  private _resolvedHostsFilePath: string | undefined;

  public load() {
    // const lines = fs.readFileSync(this.getHostsPath(), 'utf-8').split(/\r?\n/);
  }

  private getHostsPath(): string {
    if (this._resolvedHostsFilePath !== undefined) {
      return this._resolvedHostsFilePath;
    }

    for (let path of this._hostsFilePaths) {
      if (fs.existsSync(path)) {
        return path
      }
    }

    throw new Error('Hosts file not found.');
  }
}
