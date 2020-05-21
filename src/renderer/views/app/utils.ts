import {
  NavigationDrawAction,
  NavigationDrawDraggableAction,
  NavigationDrawDraggableItem
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNavigationDrawDraggableItem(arg: any): arg is NavigationDrawDraggableItem {
  return arg !== undefined &&
    arg !== null &&
    typeof arg.label === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNavigationDrawDraggableAction(arg: any): arg is NavigationDrawDraggableAction {
  return arg !== undefined &&
    arg !== null &&
    typeof arg.categoryIndex === 'number' &&
    typeof arg.action === 'string' &&
    isNavigationDrawDraggableItem(arg);
}

export function getKey(categoryIndex: number | null, entryIndex: number | null, action: NavigationDrawAction | string): string {
  return `category-${categoryIndex || 0}_entry-${entryIndex || 0}_action-${action}`;
}
