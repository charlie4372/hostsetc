/*
Provides access to the file system.
 */
export interface FileSystemAdapter {
  /*
  Determines if a path exists.
   */
  existsSync(path: string): boolean;

  /*
  Reads a file as a string.
   */
  readFile(path: string, encoding: string): Promise<string>;

  /*
  Writes a string to a file.
   */
  writeFile(path: string, content: string): Promise<void>;

  /*
  Unlinks a file.
   */
  unlink(path: string): Promise<void>;

  /*
  Copies a file.
   */
  copyFile(source: string, target: string): Promise<void>;

  /*
  Determines if a file is read only.
   */
  isReadonly(path: string): Promise<boolean>;

  /*
  Sets the read only attribute on a file.
   */
  setReadonly(path: string, value: boolean): Promise<void>;
}
