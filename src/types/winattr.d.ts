declare module 'winattr' {
  export interface WindowsFileAttributes {
    readonly: boolean;
  }

  export interface WindowsFileAttributesOptions {
    readonly?: boolean;
  }

  export interface WinAttr {
    getSync(path: string): WindowsFileAttributes;
    setSync(path: string, attrib: WindowsFileAttributesOptions);
  }

  const instance: WinAttr;

  export default instance;
}
