import fs from 'fs';
import {
  Hosts,
  convertHostsToFile, convertFileToHosts
} from "@common/hosts";
import process from 'process';

export class HostsFile {
  private _hostsFilePaths: string[] = [
    '%SystemRoot%\\system32\\drivers\\etc\\hosts',
    '/etc/hosts'
  ]

  private _resolvedHostsFilePath: string | undefined;

  private lineBreak = '\r\n';

  public hosts!: Hosts;

  public constructor() {
    this.load();
  }

  public get path(): string {
    return this._resolvedHostsFilePath || '';
  }

  public load(path?: string): void {
    const hostsPath = path && fs.existsSync(path) ? path : this.getHostsPath();
    if (hostsPath === null) {
      this.hosts = convertFileToHosts('# The hosts file could not be found.');
      this.hosts.readonly = true;
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
      fs.unlinkSync(backupPath);
    }

    fs.copyFileSync(hostsPath, backupPath);

    const content = convertHostsToFile(this.hosts, this.lineBreak);

    fs.writeFileSync(hostsPath, content);
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
}
