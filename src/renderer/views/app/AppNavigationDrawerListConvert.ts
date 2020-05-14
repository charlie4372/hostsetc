import {Hosts, HostsCategory, HostsEntry} from "@common/hosts";
import {
  NavigationDrawDraggableAction,
  NavigationDrawDraggableItem,
  NavigationDrawItem
} from "./types";
import {isNavigationDrawDraggableAction} from "./utils";

export function convertHostsToNavigationDrawItems(hosts: Hosts): NavigationDrawDraggableItem[] {
  const items: NavigationDrawDraggableItem[] = [];

  for (let categoryIndex = 0; categoryIndex < hosts.categories.length; categoryIndex++) {
    const category = hosts.categories[categoryIndex];
    items.push({
      categoryIndex: categoryIndex,
      action: 'view-category',
      label: category.name,
      titleCss: 'font-weight-bold'
    } as NavigationDrawDraggableAction);
    if (categoryIndex === 0) {
      items[items.length - 1].hidden = true
    }

    for (let entryIndex = 0; entryIndex < category.entries.length; entryIndex++) {
      const entry = category.entries[entryIndex];

      items.push({
        categoryIndex: categoryIndex,
        entryIndex: entryIndex,
        action: 'view-entry',
        label: entry.name
      } as NavigationDrawDraggableAction)
    }

    items.push({
      categoryIndex: categoryIndex,
      action: 'add-entry',
      label: 'New entry',
      titleCss: 'text--secondary'
    } as NavigationDrawDraggableAction);

    if (categoryIndex === 0) {
      items.push({
        categoryIndex: categoryIndex,
        action: 'add-category',
        label: 'New category',
        titleCss: 'text--secondary'
      } as NavigationDrawDraggableAction)
    }

    items.push({
      label: 'Separator'
    })
  }

  return items;
}

export function convertNavigationDrawItemsToHosts(items: NavigationDrawItem[], hosts: Hosts): Hosts {
  const result: Hosts = {
    categories: []
  };

  let currentCategory: HostsCategory | null = null;
  let entriesForFirstCategory: HostsEntry[] | null = null;

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];

    if (isNavigationDrawDraggableAction(item)) {
      if (item.action === 'view-category') {
        currentCategory = {
          entries: entriesForFirstCategory || [],
          name: hosts.categories[item.categoryIndex].name
        };
        result.categories.push(currentCategory);
        entriesForFirstCategory = null;
      } else if (item.action === 'view-entry' && item.entryIndex !== undefined) {
        const sourceEntry = hosts.categories[item.categoryIndex].entries[item.entryIndex];
        const newEntry = {
          name: sourceEntry.name,
          value: sourceEntry.value,
          active: sourceEntry.active
        };

        if (currentCategory !== null) {
          currentCategory.entries.push(newEntry);
        } else {
          entriesForFirstCategory = entriesForFirstCategory || [];
          entriesForFirstCategory.push(newEntry);
        }
      }
    }
  }

  for (const category of result.categories) {
    if (category.entries.length === 0) {
      category.entries.push({
        name: 'New',
        value: '',
        active: false
      });
    }
  }

  return result;
}
