import {FileSystemAdapter} from "@common/hosts-file";

/*
A basic representation of a stored file.
 */
interface TestFileSystemAdapterFile {
  /*
  The files content.
   */
  content: string;

  /*
  Stores the read only attribute.
   */
  readonly: boolean;
}

/*
A virtualised file system for testing.
 */
export class TestFileSystemAdapter implements FileSystemAdapter {
  /*
  Stores the files.
   */
  private readonly _files: { [id: string]: TestFileSystemAdapterFile } = {};

  /*
  Copies a file.
   */
  public copyFile(source: string, target: string): Promise<void> {
    if (!this.existsSync(source)) {
      throw new Error('File not found.');
    }
    if (this.existsSync(target)) {
      throw new Error('Target file exists.');
    }

    this._files[target] = {
      ...this._files[source]
    }
    return Promise.resolve();
  }

  /*
  Determines if a path exists.
   */
  public existsSync(path: string): boolean {
    return this._files[path] !== undefined;
  }

  /*
  Determines if a file is read only.
   */
  public isReadonly(path: string): Promise<boolean> {
    if (!this.existsSync(path)) {
      throw new Error('File not found.');
    }

    return Promise.resolve(this._files[path].readonly);
  }

  /*
  Reads a file as a string.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public readFile(path: string, _encoding: string): Promise<string> {
    if (!this.existsSync(path)) {
      throw new Error('File not found.');
    }

    return Promise.resolve(this._files[path].content);
  }

  /*
  Sets the read only attribute on a file.
   */
  public setReadonly(path: string, value: boolean): Promise<void> {
    if (!this.existsSync(path)) {
      throw new Error('File not found.');
    }

    this._files[path].readonly = value;

    return Promise.resolve();
  }

  /*
  Unlinks a file.
   */
  public unlink(path: string): Promise<void> {
    if (!this.existsSync(path)) {
      throw new Error('File not found.');
    }

    delete this._files[path];
    return Promise.resolve();
  }

  /*
  Writes a string to a file.
   */
  public async writeFile(path: string, content: string): Promise<void> {
    if (this.existsSync(path) && (await this.isReadonly(path))) {
      throw new Error('File is read only.')
    }

    this._files[path] = {
      content: content,
      readonly: false
    }
    return Promise.resolve(undefined);
  }
}
