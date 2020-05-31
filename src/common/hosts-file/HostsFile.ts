import fs from 'fs';
import os from 'os';
import winattr, {WindowsFileAttributes, WindowsFileAttributesOptions} from 'winattr';
import util from 'util';

import {
  Hosts,
} from "@common/hosts";
import process from 'process';
import HostsSerialiser from "@common/hosts-serialiser";

const readFile = util.promisify(fs.readFile) as (path: string, encoding: string) => Promise<string>;
const writeFile = util.promisify(fs.writeFile) as (path: string, content: string) => Promise<void>;
const unlink = util.promisify(fs.unlink) as (path: string) => Promise<void>;
const copyFile = util.promisify(fs.copyFile) as (source: string, target: string) => Promise<void>;

const getAttrWin = util.promisify(winattr.get) as (path: string) => Promise<WindowsFileAttributes>;
const setAttrWin = util.promisify(winattr.set) as (path: string, attr: WindowsFileAttributesOptions) => Promise<void>;

/*
The systems hosts file.
 */
export class HostsFile {
  /*
  The serialiser.
   */
  private readonly hostsSerialiser = new HostsSerialiser()

  /*
  The paths to search for the hosts file.
   */
  private readonly _hostsFilePaths: string[];

  /*
  The hosts file that was found and will be used for reading / writing.
   */
  private _path?: string;

  /*
  The Hosts entity that was last read / saved.
   */
  private _hosts?: Hosts;

  /*
  The hosts file content that was last read / saved.
   */
  private _content?: string;

  /*
  Creates a new instance.
   */
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

  /*
  The path to the hosts file.
  This is not set until load has been called.
   */
  public get path(): string {
    if (this._path === undefined) {
      throw new Error('Hosts file not loaded.');
    }
    return this._path;
  }

  /*
  The Hosts entity that was last read / saved.
   */
  public get hosts(): Hosts {
    if (this._hosts === undefined) {
      throw new Error('Hosts file not loaded.');
    }
    return this._hosts;
  }

  /*
  The hosts file content that was last read / saved.
   */
  public get content(): string {
    if (this._content === undefined) {
      throw new Error('Hosts file not loaded.');
    }
    return this._content;
  }

  /*
  Loads the hosts file.
  Pass in a path to load a specific hosts file.
  After this is called, hosts, content and path will all be set.
   */
  public async load(path?: string): Promise<void> {
    const hostsPath = path && fs.existsSync(path) ? path : this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }
    this._path = hostsPath;
    this._content = await readFile(hostsPath, 'utf-8');
    this._hosts = this.hostsSerialiser.deserialise(this._content);
  }

  /*
  Saves a Hosts entity, or a hosts file.
  Requires that load has been called.
   */
  public async save(value: Hosts | string): Promise<void> {
    if (this._path === undefined) {
      throw new Error('Hosts file not loaded.');
    }

    if (typeof value === "string") {
      this._hosts = this.hostsSerialiser.deserialise(value)
      this._content = value;
    } else {
      this._hosts = value;
      this._content = this.hostsSerialiser.serialise(value);
    }

    const backupPath = this.path + '.bak';

    if (fs.existsSync(backupPath)) {
      await this.setReadOnlyWin32(backupPath, false);
      await unlink(backupPath);
    }

    await copyFile(this.path, backupPath);

    const content = this.hostsSerialiser.serialise(this._hosts, os.EOL);

    const isReadonly = await this.isReadOnlyWin32(this.path);
    if (isReadonly) {
      await this.setReadOnlyWin32(this.path, false);
    }

    await writeFile(this.path, content);

    if (isReadonly) {
      await this.setReadOnlyWin32(this.path, true);
    }
  }

  /*
  Gets the path to the systems hosts file.
   */
  private getHostsPath(): string | null {
    if (this._path !== undefined) {
      return this._path;
    }

    for (const path of this._hostsFilePaths) {
      const pathToUse = path.replace(/%([^%]+)%/gi, (_,n) => process.env[n] || '')

      if (fs.existsSync(pathToUse)) {
        this._path = pathToUse;
        return pathToUse
      }
    }

    return null;
  }

  /*
  Determines if a file is readonly on a Windows system.
   */
  private async isReadOnlyWin32(path: string): Promise<boolean> {
    if (process.platform === 'win32') {
      const result = await getAttrWin(path);
      return result.readonly;
    }

    return false;
  }

  /*
  Changes the read only flag on a Windows system.
   */
  private async setReadOnlyWin32(path: string, isReadonly: boolean): Promise<void> {
    if (process.platform !== 'win32') {
      return;
    }

    await setAttrWin(path,{ readonly: isReadonly });
  }
}
