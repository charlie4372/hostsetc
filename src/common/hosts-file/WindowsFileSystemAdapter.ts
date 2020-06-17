import util from "util";
import winattr, {WindowsFileAttributes, WindowsFileAttributesOptions} from "winattr";
import {StandardFileSystemAdapter} from "@common/hosts-file/StandardFileSystemAdapter";

// Promisify all the winattr functions that we need.
const getAttrWin = util.promisify(winattr.get) as (path: string) => Promise<WindowsFileAttributes>;
const setAttrWin = util.promisify(winattr.set) as (path: string, attr: WindowsFileAttributesOptions) => Promise<void>;

/*
The Windows file system.
 */
export class WindowsFileSystemAdapter extends StandardFileSystemAdapter {
  /*
  Determines if a file is read only.
   */
  public async isReadonly(path: string): Promise<boolean> {
    const result = await getAttrWin(path);
    return result.readonly;
  }

  /*
  Sets the read only attribute on a file.
   */
  public setReadonly(path: string, value: boolean): Promise<void> {
    return setAttrWin(path,{ readonly: value });
  }
}
