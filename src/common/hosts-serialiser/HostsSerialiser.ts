import {Hosts, HostsCategory, HostsEntry} from "@common/hosts";
import {ipV4Record, ipV6Record, leadingComment, startOfCategoryBlock, startOfEntryBlock} from "./regex";
import {v4 as uuidv4} from "uuid";

/*
Seralises hosts files to Hosts entities.
 */
export class HostsSerialiser {
  /*
  Converts a Hosts entity into a hosts file.
  */
  public serialise(hosts: Hosts, lineBreak = '\n'): string {
    // The first category, and the first entry do not get headers.
    // This is where the normal hosts file lives
    let content: string[] = [];

    for (let categoryIndex = 0; categoryIndex < hosts.categories.length; categoryIndex++) {
      const category = hosts.categories[categoryIndex];

      // Write out a category header.
      // This is where we will be storing all of the category information that we need to persist.
      content.push(`####Category:${category.name}####`);

      for (let entryIndex = 0; entryIndex < category.entries.length; entryIndex++) {
        const entry = category.entries[entryIndex];

        // Write out the entry header.
        // This is where we will be storing all of the entry information that we need to persist.
        content.push(`####Entry:${entry.name}####`);

        // Write out the entries value.
        content = content.concat(this.serialiseHostsContent(entry));
      }
    }

    // Convert the content to a string with line breaks.
    return content.join(lineBreak);
  }


  /*
  Converts a host file into a Hosts entity.
  */
  public deserialise(content: string): Hosts {
    // Convert all line breaks into a common linebreak.
    const lines = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n');

    // Create the hosts entry.
    const hosts: Hosts = {
      categories: []
    };

    // Hosts files that haven't been seen before will not have category and entry headers.
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
          content: '',
          active: false
        }

        // If there is no current category (ie. the entry is the first thing in the file),
        // create it and add the entry to it.
        if (currentCategory === null) {
          currentCategory = this.createDefaultCategory();
          hosts.categories.push(currentCategory);
        }
        currentCategory.entries.push(currentEntry)
      } else {
        // The is actual content. Add it to the current entry.

        // If there is no current entry, create an entry and add it to the current category.
        if (currentEntry === null) {
          currentEntry = this.createDefaultEntry()

          // If there is no current category (ie. the entry is the first thing in the file),
          // create it and add the entry to it.
          if (currentCategory === null) {
            currentCategory = this.createDefaultCategory();
            hosts.categories.push(currentCategory);
          }
          currentCategory.entries.push(currentEntry);
        }

        // Add the content to the entry.
        if (currentEntry.content.length === 0) {
          currentEntry.content = line
        } else {
          currentEntry.content += '\n' + line;
        }
      }
    }

    // Set the active flag on all of the entries.
    for (const category of hosts.categories) {
      for (const entry of category.entries) {
        entry.active = this.isEntryContentActive(entry.content);
        if (!entry.active) {
          entry.content = this.removeLeadingCommentsForSignificantLines(entry.content);
        }
      }
    }

    // Return the result.
    return hosts;
  }

  /*
  Formats a hosts value for use in a hosts file.
  */
  private serialiseHostsContent(entry: HostsEntry): string[] {
    return entry
      .content
      .split('\n')
      .map(line => {
        // If the entry is active, then use the content as is.
        if (entry.active) {
          return line;
        }

        // Significant lines need to be commented out.
        if (this.isLineSignificant(line)) {
          return '#' + line;
        }

        // Non significant lines get written out as it.
        return line;
      });
  }

  /*
  Determines if an entry is active by its content.
  If there are any IP address lines that are not commented out, then it will be considered active.
   */
  private isEntryContentActive(value: string): boolean {
    return value
      .split('\n')
      .some(line => this.isLineSignificant(line) && line.match(leadingComment) === null);
  }

  /*
  Determines if a line is significant.
  A significant line is one that has an IP4, or IP6 address in it.
   */
  private isLineSignificant(line: string): boolean {
    return line.match(ipV4Record) !== null ||
      line.match(ipV6Record) !== null;
  }

  /*
  Creates the default category.
   */
  private createDefaultCategory(): HostsCategory {
    return {
      entries: [],
      id: uuidv4(),
      name: 'Default'
    }
  }

  /*
  Creates the default entry.
   */
  private createDefaultEntry(): HostsEntry {
    return {
      id: uuidv4(),
      name: 'Default',
      content: '',
      active: true
    }
  }

  /*
  Removes the leading comments from significant lines.
  The leading comments are how inactive records are managed.
  They are not something the end user wants to deal with.
   */
  private removeLeadingCommentsForSignificantLines(content: string): string {
    return content
      .split('\n')
      .map((line) => {
        if (this.isLineSignificant(line)) {
          return line.replace(leadingComment, '');
        } else {
          return line;
        }
      })
      .join('\n');
  }
}
