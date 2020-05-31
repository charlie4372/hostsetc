import util from "util";
import fs from "fs";
import {FileSystemAdapter} from "./types";

// Promisify all the fs functions that we need.
const readFile = util.promisify(fs.readFile) as (path: string, encoding: string) => Promise<string>;
const writeFile = util.promisify(fs.writeFile) as (path: string, content: string) => Promise<void>;
const unlink = util.promisify(fs.unlink) as (path: string) => Promise<void>;
const copyFile = util.promisify(fs.copyFile) as (source: string, target: string) => Promise<void>;

/*
The standard file system.
This will work for for any environment.
OS specific method implementations will not work.
 */
export class StandardFileSystemAdapter implements FileSystemAdapter {
  /*
  Determines if a path exists.
   */
  public existsSync(path: string): boolean {
    return fs.existsSync(path);
  }

  /*
  Copies a file.
   */
  public copyFile(source: string, target: string): Promise<void> {
    return copyFile(source, target);
  }

  /*
  Reads a file as a string.
   */
  public readFile(path: string, encoding: string): Promise<string> {
    return readFile(path, encoding);
  }

  /*
  Unlinks a file.
   */
  public unlink(path: string): Promise<void> {
    return unlink(path);
  }

  /*
  Writes a string to a file.
   */
  public writeFile(path: string, content: string): Promise<void> {
    return writeFile(path, content);
  }

  /*
  Determines if a file is read only.
  This will always be false.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isReadonly(path: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  /*
  Sets the read only attribute on a file.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setReadonly(path: string, value: boolean): Promise<void> {
    return Promise.resolve(undefined);
  }
}
