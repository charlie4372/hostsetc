export interface Hosts {
  main: HostsEntry;
  entries: HostsEntry[];
  categories: HostsCategory[];
  readonly: boolean;
}

export interface HostsEntry {
  name: string;
  value: string;
  // records: HostsRecord[];
  active: boolean;
}

export interface HostsRecord {
  enabled: boolean;
  value: string;
}

export interface HostsCategory {
  name: string;
  entries: HostsEntry[];
}
