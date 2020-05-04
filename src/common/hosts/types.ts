export interface Hosts {
  categories: HostsCategory[];
  readonly: boolean;
}

export interface HostsEntry {
  name: string;
  value: string;
  active: boolean;
}

export interface HostsCategory {
  name: string;
  entries: HostsEntry[];
}
