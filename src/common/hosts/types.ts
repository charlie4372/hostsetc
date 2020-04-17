export interface Hosts {
  main: HostsEntry;
  categories: HostsCategory[];
  readonly: boolean;
}

export interface HostsEntry {
  name?: string;
  value: string;
  // records: HostsRecord[];
}

export interface HostsRecord {
  enabled: boolean;
  value: string;
}

export interface HostsCategory {
  name: string;
  entries: HostsEntry[];
}
