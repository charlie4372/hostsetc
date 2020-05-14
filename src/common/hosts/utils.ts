import {Hosts, HostsCategory, HostsEntry} from "@common/hosts/types";

const ipV4Record = /^\s*#?\s*(?:[0-9]{1,3}\.){3}[0-9]{1,3}\s+([^#]+)/;
const ipV6Record = /^\s*#?\s*(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\s+([^#]+)/;
const hasLeadingComment = /^\s*[^#]/;
const leadingComment = /^\s*#+\s*/;

const startOfCategoryBlock = /^####Category:(?<name>.*)####$/
const startOfEntryBlock = /^####Entry:(?<name>.*)####$/

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

export function convertHostsToFile(hosts: Hosts, lineBreak = '\n'): string {
  // The first category, and the first entry do not get headers.
  // This is where the normal hosts file lives
  let content = '';

  for (let categoryIndex = 0; categoryIndex < hosts.categories.length; categoryIndex++) {
    const category = hosts.categories[categoryIndex];

    if (categoryIndex !== 0) {
      content += `####Category:${category.name}####${lineBreak}`
    }

    for (let entryIndex = 0; entryIndex < category.entries.length; entryIndex++) {
      const entry = category.entries[entryIndex];

      if (categoryIndex !== 0 || entryIndex !== 0) {
        content += `####Entry:${entry.name}####${lineBreak}`
      }
      content += `${renderEntryRecords(entry, lineBreak)}${lineBreak}`
    }
  }

  return content;
}

export function convertFileToHosts(content: string): Hosts {
  const lines = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n');

  const hosts: Hosts = {
    categories: [{
      name: 'Default',
      entries: [{
        name: 'Main',
        value: '',
        active: false
      }]
    }]
  }

  let currentCategory: HostsCategory  = hosts.categories[0];
  let currentEntry: HostsEntry = currentCategory.entries[0];

  for (const line of lines) {
    const startOfCategory = line.match(startOfCategoryBlock);
    const startOfEntry = line.match(startOfEntryBlock);

    if (startOfCategory !== null) {
      currentCategory = {
        name: startOfCategory.groups ? startOfCategory.groups.name : '',
        entries: []
      }
      hosts.categories.push(currentCategory);
    } else if (startOfEntry !== null) {
      currentEntry = {
        name: startOfEntry.groups ? startOfEntry.groups.name : '',
        value: '',
        active: false
      }
      currentCategory.entries.push(currentEntry)
    } else {
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
