export interface NavigationDrawSelection {
  categoryIndex: number;
  entryIndex: number;
}

export type NavigationDrawAction = 'view-entry'|'view-category'|'add-entry'|'add-category'|'view-file';
