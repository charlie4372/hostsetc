import {Hosts, HostsCategory, HostsEntry} from "@common/hosts/types";
import { v4 as uuidv4 } from 'uuid';

/*
Creates a new Hosts entity.
 */
export function createNewHosts(): Hosts {
  return {
    categories: [{
      id: uuidv4(),
      name: 'Default',
      entries: [{
        id: uuidv4(),
        name: 'Main',
        content: '',
        active: true
      }]
    }]
  };
}

/*
Creates a new HostsEntry entity.
 */
export function createNewEntry(): HostsEntry {
  return {
    id: uuidv4(),
    name: 'New',
    content: '',
    active: false
  };
}

/*
Creates a new HostsCategory entity.
 */
export function createNewCategory(): HostsCategory {
  return {
    id: uuidv4(),
    name: 'New',
    entries: [
      createNewEntry()
    ]
  }
}

/*
Type guard for Hosts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHostsEntry(arg: any): arg is HostsEntry {
  if (arg === null || arg === undefined) {
    return false;
  }

  return typeof arg.id === 'string' &&
    typeof arg.name === 'string' &&
    typeof arg.content === 'string' &&
    typeof arg.active === 'boolean';
}

/*
Type guard for HostsCategory.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHostsCategory(arg: any): arg is HostsCategory {
  if (arg === null || arg === undefined) {
    return false;
  }

  return typeof arg.id === 'string' &&
    typeof arg.name === 'string' &&
    Array.isArray(arg.entries) &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg.entries.every((e: any) => isHostsEntry(e));
}

/*
Gets HostsCategory entity that contains a HostsEntry with a given id from a Hosts entity.
 */
export function getCategoryWithEntryFromHosts(hosts: Hosts, id: string): HostsCategory | null {
  const items = hosts.categories.filter((category): boolean => {
    return category.entries.some((entry): boolean => {
      return entry.id === id;
    });
  });
  return items.length > 0 ? items[0] : null;
}

/*
Gets HostsEntry entity by its id from a Hosts entity.
 */
export function getEntryFromHosts(hosts: Hosts, id: string): HostsEntry | null {
  const category = getCategoryWithEntryFromHosts(hosts, id);
  if (category === null) {
    return null;
  }

  const items = category.entries.filter((entry): boolean => {
    return entry.id === id;
  });

  return items.length > 0 ? items[0] : null;
}

/*
Gets HostsCategory entity by its id from a Hosts entity.
 */
export function getCategoryFromHosts(hosts: Hosts, id: string): HostsCategory | null {
  const items = hosts.categories.filter((category): boolean => {
    return category.id === id;
  });

  return items.length > 0 ? items[0] : null;
}
