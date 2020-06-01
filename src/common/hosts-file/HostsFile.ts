import os from 'os';

import {
  Hosts,
} from "@common/hosts";
import process from 'process';
import HostsSerialiser from "@common/hosts-serialiser";
import {FileSystemAdapter} from "@common/hosts-file/types";
import {FileSystemFactory} from "@common/hosts-file/FileSystemFactory";

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
  The file system to use.
   */
  private readonly _fileSystem: FileSystemAdapter;

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
  public constructor(fileSystem?: FileSystemAdapter) {
    if (process.platform === 'win32') {
      this._hostsFilePaths = [
        '%SystemRoot%\\system32\\drivers\\etc\\hosts',
        // This will never resolve, but helps servers as a common path for tests to use.
        '/etc/hosts'
      ]
    } else {
      this._hostsFilePaths = [
        '/etc/hosts'
      ]
    }

    // Initialise the file system if one is not provided.
    this._fileSystem = fileSystem ?? FileSystemFactory.create();
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
  This is not set until load has been called.
   */
  public get hosts(): Hosts {
    if (this._hosts === undefined) {
      throw new Error('Hosts file not loaded.');
    }
    return this._hosts;
  }

  /*
  The hosts file content that was last read / saved.
  This is not set until load has been called.
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
    const hostsPath = path && this._fileSystem.existsSync(path) ? path : this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }
    this._path = hostsPath;
    this._content = await this._fileSystem.readFile(hostsPath, 'utf-8');
    this._hosts = this.hostsSerialiser.deserialise(this._content);
  }

  /*
  Saves a Hosts entity, or a hosts file.
  Requires that load has been called.
  This will copy the existing hosts file to *.bak
   */
  public async save(value: Hosts | string): Promise<void> {
    if (this._path === undefined) {
      throw new Error('Hosts file not loaded.');
    }

    if (typeof value === "string") {
      this._hosts = this.hostsSerialiser.deserialise(value);
      this._content = value;
    } else {
      this._hosts = value;
      this._content = this.hostsSerialiser.serialise(value, '\n');
    }

    const backupPath = this.path + '.bak';

    // If there already is a backup, delete it.
    if (this._fileSystem.existsSync(backupPath)) {
      await this._fileSystem.setReadonly(backupPath, false);
      await this._fileSystem.unlink(backupPath);
    }

    // Copy the existing hosts file to the backup.
    await this._fileSystem.copyFile(this.path, backupPath);

    // Is the file is read only, we will need to turn if off for the write,
    // and turn if back on after.
    const isReadonly = await this._fileSystem.isReadonly(this.path);
    if (isReadonly) {
      await this._fileSystem.setReadonly(this.path, false);
    }

    // Serialise it again, the file should use the systems EOL,
    // not the runtime EOL that is being used.
    const content = this.hostsSerialiser.serialise(this._hosts, os.EOL);
    await this._fileSystem.writeFile(this.path, content);

    // If we turned off the read only attribute, turn it back on.
    if (isReadonly) {
      await this._fileSystem.setReadonly(this.path, true);
    }
  }

  /*
  Gets the path to the systems hosts file.
   */
  private getHostsPath(): string | null {
    if (this._path !== undefined) {
      return this._path;
    }

    // Got through all the available hosts paths.
    for (const path of this._hostsFilePaths) {
      // The paths to use may have environment variables in them, they will need to be resolved.
      const pathToUse = path.replace(/%([^%]+)%/gi, (_,n) => process.env[n] || '')

      // If it exists, then use it.
      if (this._fileSystem.existsSync(pathToUse)) {
        this._path = pathToUse;
        return pathToUse
      }
    }

    return null;
  }
}
