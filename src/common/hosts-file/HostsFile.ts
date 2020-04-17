import fs from 'fs';
import {Hosts} from "@common/hosts";
import process from 'process';

const startOfCategory = /^####\+\+\+Category (?:<name>.*)[\s#]*$/
const endOfCategory = /^ ####\-\-\-Category /

const startOfEntry = /^####\+\+\+Entry (?:<name>.*)[\s#]*$/
const endOfEntry = /^ ####\-\-\-Entry /

export class HostsFile {
  private _hostsFilePaths: string[] = [
    '%SystemRoot%/system32/drivers/etc/hosts',
    '/etc/hosts'
  ]

  private _resolvedHostsFilePath: string | undefined;

  private lineBreak: string = '\r\n';

  public hosts!: Hosts;

  public constructor() {
    this.load();
  }

  public load() {
    const hostsPath = this.getHostsPath();
    if (hostsPath === null) {
      this.hosts = {
        main: {
          value: '# The hosts file could not be found.'
        },
        categories: [],
        readonly: true
      }
      return;
    }

    const lines = fs.readFileSync(hostsPath, 'utf-8');

    const hosts = {
      main: {
        value: lines
      },
      categories: [],
      readonly: false
    }

    this.hosts = hosts;
  }

  public Save(): void {
    const hostsPath = this.getHostsPath();
    if (hostsPath === null) {
      throw new Error('Hosts file not found.');
    }

    const backupPath = hostsPath + '.bak';

    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    fs.copyFileSync(hostsPath, backupPath);

    let content = this.trimTrailingLineBreaks(this.hosts.main.value) + this.lineBreak;

    for (let category of this.hosts.categories) {
      content += `####+++Category ${category.name}${this.lineBreak}`
      
      for (let entry of category.entries) {
        content += `####+++Entry ${entry.name}${this.lineBreak}`
        content += `${this.trimTrailingLineBreaks(entry.value)}${this.lineBreak}`
        content += `####---Entry ${entry.name}${this.lineBreak}`
      }

      content += `####---Category ${category.name}${this.lineBreak}`
    }

    fs.writeFileSync(hostsPath, content);
  }

  private trimTrailingLineBreaks(value: string): string {
    return value;
  }

  private getHostsPath(): string | null {
    if (this._resolvedHostsFilePath !== undefined) {
      return this._resolvedHostsFilePath;
    }

    for (let path of this._hostsFilePaths) {
      const pathToUse = path.replace(/%([^%]+)%/gi, (_,n) => process.env[n] || '')

      if (fs.existsSync(pathToUse)) {
        this._resolvedHostsFilePath = pathToUse;
        return pathToUse
      }
    }

    return null;
  }
}
