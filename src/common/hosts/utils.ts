import {Hosts, HostsCategory, HostsEntry} from "@common/hosts/types";
import { v4 as uuidv4 } from 'uuid';

const ipV4Record = /^\s*#?\s*(?:[0-9]{1,3}\.){3}[0-9]{1,3}\s+([^#]+)/;
const ipV6Record = /^\s*#?\s*(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\s+([^#]+)/;
const hasLeadingComment = /^\s*[^#]/;
const leadingComment = /^\s*#+\s*/;

const startOfCategoryBlock = /^####Category:(?<name>.*)####$/
const startOfEntryBlock = /^####Entry:(?<name>.*)####$/

export function createNewHosts(): Hosts {
  return {
    categories: [{
      id: uuidv4(),
      name: 'Default',
      entries: [{
        id: uuidv4(),
        name: 'Main',
        value: '',
        active: false
      }]
    }]
  };
}

export function isIpV4Record(line: string): boolean {
  return line.match(ipV4Record) !== null;
}

export function isIpV6Record(line: string): boolean {
  return line.match(ipV6Record) !== null;
}

export function isRecordActive(line: string): boolean {
  return line.match(hasLeadingComment) !== null;
}

export function isRecordSignificant(line: string): boolean {
  return isIpV4Record(line) || isIpV6Record(line);
}

export function formatEntryRecord(line: string): string {
  if (!isRecordSignificant(line)) {
    return line;
  }

  return line.replace(leadingComment, '');
}

export function renderEntryRecord(line: string, isActive: boolean): string {
  if (!isRecordSignificant(line)) {
    return line;
  }

  if (isActive) {
    return line.replace(leadingComment, '');
  } else {
    if (line.match(leadingComment)) {
      return line;
    }
    return '#' + line;
  }
}

export function isEntryActive(entry: HostsEntry): boolean {
  return entry.value
    .split('\n')
    .some(line => isRecordActive(line));
}

export function formatEntryValueForObject(entry: HostsEntry): string {
  if (entry.active) {
    return entry.value;
  }

  return entry.value.split('\n')
    .map((line) => {
      if (isRecordSignificant(line)) {
        return formatEntryRecord(line);
      } else {
        return line;
      }
    })
    .join('\n');
}

function renderEntryRecords(entry: HostsEntry, lineBreak: string): string {
  const lines = entry.value
    .split('\n')
    .map(line => renderEntryRecord(line, entry.active));

  return lines.join(lineBreak);
}

function appendLine(current: string, toAppend: string, lineBreak = '\n'): string {
  if (current.length === 0) {
    return toAppend
  }

  return current + lineBreak + toAppend;
}

export function convertHostsToFile(hosts: Hosts, lineBreak = '\n'): string {
  // The first category, and the first entry do not get headers.
  // This is where the normal hosts file lives
  let content = '';

  for (let categoryIndex = 0; categoryIndex < hosts.categories.length; categoryIndex++) {
    const category = hosts.categories[categoryIndex];

    content = appendLine(content, `####Category:${category.name}####`, lineBreak);

    for (let entryIndex = 0; entryIndex < category.entries.length; entryIndex++) {
      const entry = category.entries[entryIndex];

      content = appendLine(content, `####Entry:${entry.name}####`, lineBreak);
      content = appendLine(content, `${renderEntryRecords(entry, lineBreak)}`, lineBreak);
    }
  }

  return content;
}

function createDefaultCategory(): HostsCategory {
  return {
    entries: [],
    id: uuidv4(),
    name: 'Default'
  }
}

function createDefaultEntry(): HostsEntry {
  return {
    id: uuidv4(),
    name: 'Default',
    value: '',
    active: true
  }
}

export function convertFileToHosts(content: string): Hosts {
  const lines = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n');

  const hosts: Hosts = {
    categories: []
  };

  // Hosts files that haven't been seen before will not have hosts and category headers.
  // These will be created when the content is hit.
  // If there are headers, use them.
  let currentCategory: HostsCategory | null = null;
  let currentEntry: HostsEntry | null = null;

  for (const line of lines) {
    const startOfCategory = line.match(startOfCategoryBlock);
    const startOfEntry = line.match(startOfEntryBlock);

    if (startOfCategory !== null) {
      // Category detected, make it the new current category.
      currentCategory = {
        id: uuidv4(),
        name: startOfCategory.groups ? startOfCategory.groups.name : '',
        entries: []
      }
      hosts.categories.push(currentCategory);
    } else if (startOfEntry !== null) {
      // Entry detected, make it the new current entry.
      currentEntry = {
        id: uuidv4(),
        name: startOfEntry.groups ? startOfEntry.groups.name : '',
        value: '',
        active: false
      }

      // If there is no current category (ie. the entry is the first thing in the file)
      // Create it and add the entry to it.
      if (currentCategory === null) {
        currentCategory = createDefaultCategory();
        hosts.categories.push(currentCategory);
      }
      currentCategory.entries.push(currentEntry)
    } else {
      // The is actual content. Add it to the current entry.

      // If there is no current entry, create an entry and add it to the current category.
      if (currentEntry === null) {
        currentEntry = createDefaultEntry()

        // If there is no current category (ie. the entry is the first thing in the file)
        // Create it and add the entry to it.
        if (currentCategory === null) {
          currentCategory = createDefaultCategory();
          hosts.categories.push(currentCategory);
        }
        currentCategory.entries.push(currentEntry);
      }

      // Add the content to the entry.
      if (currentEntry.value.length === 0) {
        currentEntry.value = line
      } else {
        currentEntry.value += '\n' + line;
      }
    }
  }

  // Set the active flag on all of the entries
  for (const category of hosts.categories) {
    for (const entry of category.entries) {
      entry.active = isEntryActive(entry);
      if (!entry.active) {
        entry.value = formatEntryValueForObject(entry);
      }
    }
  }

  return hosts;
}

export function createNewEntry(): HostsEntry {
  return {
    id: uuidv4(),
    name: 'New',
    value: '',
    active: false
  };
}

export function createNewCategory(): HostsCategory {
  return {
    id: uuidv4(),
    name: 'New',
    entries: [
      createNewEntry()
    ]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHostsEntry(arg: any): arg is HostsEntry {
  if (arg === null || arg === undefined) {
    return false;
  }

  return typeof arg.name === 'string' &&
    typeof arg.name === 'string' &&
    typeof arg.value === 'string' &&
    typeof arg.active === 'boolean';
}

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

export function getCategoryWithEntryFromHosts(hosts: Hosts, id: string): HostsCategory | null {
  const items = hosts.categories.filter((category): boolean => {
    return category.entries.some((entry): boolean => {
      return entry.id === id;
    });
  });
  return items.length > 0 ? items[0] : null;
}

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

export function getCategoryFromHosts(hosts: Hosts, id: string): HostsCategory | null {
  const items = hosts.categories.filter((category): boolean => {
    return category.id === id;
  });

  return items.length > 0 ? items[0] : null;
}
