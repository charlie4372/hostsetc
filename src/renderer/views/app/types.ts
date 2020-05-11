import {HostsCategory, HostsEntry} from "@common/hosts";

export interface NavigationDrawSelection {
  categoryIndex: number;
  entryIndex: number;
}

export type NavigationDrawAction = 'view-entry'|'view-category'|'add-entry'|'add-category'|'view-file';

export interface NavigationDrawDraggableItem {
  index: number;
  categoryIndex?: number;
  entryIndex?: number;
  category?: HostsCategory;
  entry?: HostsEntry;
  action?: NavigationDrawAction;
  label: string;
  titleCss?: string;
}
