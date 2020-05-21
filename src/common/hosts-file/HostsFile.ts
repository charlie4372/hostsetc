import fs from 'fs';
import os from 'os';
import winattr from 'winattr';

import {
  Hosts,
  convertHostsToFile, convertFileToHosts
} from "@common/hosts";
import process from 'process';

export class HostsFile {
  private readonly _hostsFilePaths: string[];

  private _resolvedHostsFilePath: string | undefined;

  public hosts!: Hosts;

  public constructor() {
    if (process.platform === 'win32') {
      this._hostsFilePaths = [
        '%SystemRoot%\\system32\\drivers\\etc\\hosts'
      ]
    } else {
      this._hostsFilePaths = [
        '/etc/hosts'
      ]
    }

    this.load();
  }

  public get path(): string {
    return this._resolvedHostsFilePath || '';
  }

  public load(path?: string): void {
    const hostsPath = path && fs.existsSync(path) ? path : this.getHostsPath();
    if (hostsPath === null) {
      this.hosts = convertFileToHosts('# The hosts file could not be found.');
      return;
    }

    const content = fs.readFileSync(hostsPath, 'utf-8');

    this.hosts = convertFileToHosts(content);
  }

  public save(): void {
    const hostsPath = this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }

    const backupPath = hostsPath + '.bak';

    if (fs.existsSync(backupPath)) {
      this.setReadOnlyWin32(backupPath, false);
      fs.unlinkSync(backupPath);
    }

    fs.copyFileSync(hostsPath, backupPath);

    const content = convertHostsToFile(this.hosts, os.EOL);

    const isReadonly = this.isReadOnlyWin32(hostsPath);
    if (isReadonly) {
      this.setReadOnlyWin32(hostsPath, false);
    }

    fs.writeFileSync(hostsPath, content);

    if (isReadonly) {
      this.setReadOnlyWin32(hostsPath, true);
    }
  }

  private getHostsPath(): string | null {
    if (this._resolvedHostsFilePath !== undefined) {
      return this._resolvedHostsFilePath;
    }

    for (const path of this._hostsFilePaths) {
      const pathToUse = path.replace(/%([^%]+)%/gi, (_,n) => process.env[n] || '')

      if (fs.existsSync(pathToUse)) {
        this._resolvedHostsFilePath = pathToUse;
        return pathToUse
      }
    }

    return null;
  }

  private isReadOnlyWin32(path: string): boolean {
    if (process.platform === 'win32') {
      return winattr.getSync(path).readonly;
    }

    return false;
  }

  private setReadOnlyWin32(path: string, isReadonly: boolean): void {
    if (process.platform !== 'win32') {
      return;
    }

    winattr.setSync(path, { readonly: isReadonly });
  }
}
