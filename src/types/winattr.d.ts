declare module 'winattr' {
  export interface WindowsFileAttributes {
    readonly: boolean;
  }

  export interface WindowsFileAttributesOptions {
    readonly?: boolean;
  }

  export interface WinAttr {
    get(path: string, callback: (err: any, data: WindowsFileAttributes) => void): void;
    getSync(path: string): WindowsFileAttributes;

    set(path: string, attrib: WindowsFileAttributesOptions, callback: (err: any) => void): void;
    setSync(path: string, attrib: WindowsFileAttributesOptions);
  }

  const instance: WinAttr;
  export default instance;
}
