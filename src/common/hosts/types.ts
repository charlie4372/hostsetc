export interface Hosts {
  main: HostsEntry;
  categories: HostsCategory[];
}

export interface HostsEntry {
  name?: string;
  records: HostsRecord[];
}

export interface HostsRecord {
  enabled: boolean;
  value: string;
}

export interface HostsCategory {
  name: string;
  entries: HostsEntry[];
}
