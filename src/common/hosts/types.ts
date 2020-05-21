export interface Hosts {
  categories: HostsCategory[];
}

export interface HostsEntry {
  id: string;
  name: string;
  value: string;
  active: boolean;
}

export interface HostsCategory {
  id: string;
  name: string;
  entries: HostsEntry[];
}
