import fs from 'fs';
import os from 'os';
import winattr, {WindowsFileAttributes, WindowsFileAttributesOptions} from 'winattr';
import util from 'util';

import {
  Hosts,
  convertHostsToFile, convertFileToHosts
} from "@common/hosts";
import process from 'process';

const readFile = util.promisify(fs.readFile) as (path: string, encoding: string) => Promise<string>;
const writeFile = util.promisify(fs.writeFile) as (path: string, content: string) => Promise<void>;
const unlink = util.promisify(fs.unlink) as (path: string) => Promise<void>;
const copyFile = util.promisify(fs.copyFile) as (source: string, target: string) => Promise<void>;

const getAttrWin = util.promisify(winattr.get) as (path: string) => Promise<WindowsFileAttributes>;
const setAttrWin = util.promisify(winattr.set) as (path: string, attr: WindowsFileAttributesOptions) => Promise<void>;

export class HostsFile {
  private readonly _hostsFilePaths: string[];
  private _resolvedHostsFilePath: string | undefined;
  public hosts: Hosts | null = null;
  public content: string | null = null;

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
  }

  public get path(): string {
    return this._resolvedHostsFilePath || '';
  }

  public async load(path?: string): Promise<void> {
    const hostsPath = path && fs.existsSync(path) ? path : this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }
    this.content = await readFile(hostsPath, 'utf-8');
    this.hosts = convertFileToHosts(this.content);
  }

  public async save(): Promise<void> {
    if (this.hosts === null) {
      throw new Error('Hosts not set.');
    }

    const hostsPath = this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }

    const backupPath = hostsPath + '.bak';

    if (fs.existsSync(backupPath)) {
      await this.setReadOnlyWin32(backupPath, false);
      await unlink(backupPath);
    }

    await copyFile(hostsPath, backupPath);

    const content = convertHostsToFile(this.hosts, os.EOL);

    const isReadonly = await this.isReadOnlyWin32(hostsPath);
    if (isReadonly) {
      await this.setReadOnlyWin32(hostsPath, false);
    }

    await writeFile(hostsPath, content);

    if (isReadonly) {
      await this.setReadOnlyWin32(hostsPath, true);
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

  private async isReadOnlyWin32(path: string): Promise<boolean> {
    if (process.platform === 'win32') {
      const result = await getAttrWin(path);
      return result.readonly;
    }

    return false;
  }

  private async setReadOnlyWin32(path: string, isReadonly: boolean): Promise<void> {
    if (process.platform !== 'win32') {
      return;
    }

    await setAttrWin(path,{ readonly: isReadonly });
  }
}
