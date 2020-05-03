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
    .map(line => renderEntryRecord(line, entry.active))

  // // Remove the trailing line breaks
  // let lineIndex = lines.length - 1;
  // while (lineIndex >= 0) {
  //   if (lines[lineIndex].trim() === '') {
  //     lines.splice(lineIndex, 1);
  //     lineIndex--;
  //   } else {
  //     return lines.join(lineBreak);
  //   }
  // }

  return lines.join(lineBreak);
}

export function convertHostsToFile(hosts: Hosts, lineBreak = '\n'): string {
  let content = renderEntryRecords(hosts.main, lineBreak) + lineBreak;

  for (const entry of hosts.entries) {
    content += `####Entry:${entry.name}####${lineBreak}`
    content += `${renderEntryRecords(entry, lineBreak)}${lineBreak}`
  }

  for (const category of hosts.categories) {
    content += `####Category:${category.name}####${lineBreak}`

    for (const entry of category.entries) {
      content += `####Entry:${entry.name}####${lineBreak}`
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
    main: {
      name: 'Main',
      value: '',
      active: false
    },
    entries: [],
    categories: [],
    readonly: false
  }

  let currentCategory: HostsCategory | null = null;
  let currentEntry: HostsEntry = hosts.main;

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
      if (currentCategory === null) {
        hosts.entries.push(currentEntry);
      } else {
        currentCategory.entries.push(currentEntry)
      }
    } else {
      if (currentEntry.value.length === 0) {
        currentEntry.value = line
      } else {
        currentEntry.value += '\n' + line;
      }
    }
  }

  // Set the active flag on all of the entries
  hosts.main.active = isEntryActive(hosts.main);
  if (!hosts.main.active) {
    hosts.main.value = formatEntryValueForObject(hosts.main);
  }

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
