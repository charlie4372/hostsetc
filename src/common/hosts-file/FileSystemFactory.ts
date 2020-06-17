import {FileSystemAdapter} from "@common/hosts-file/types";
import process from "process";
import {WindowsFileSystemAdapter} from "@common/hosts-file/WindowsFileSystemAdapter";
import {StandardFileSystemAdapter} from "@common/hosts-file/StandardFileSystemAdapter";

/*
Creates instances of FileSystem.
 */
export class FileSystemFactory {
  /*
  Creates an instance of FileSystem.
  */
  public static create(): FileSystemAdapter {
    // If Windows, create the WindowsFileSystem.
    if (process.platform === 'win32') {
      return new WindowsFileSystemAdapter();
    }

    // For everything else, the Standard one will do.
    return new StandardFileSystemAdapter();
  }
}
