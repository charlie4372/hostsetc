/*
This is a guessed interface.
draggable doesn't have decent typerscript bindings so have added
just enough to satisfy my needs.

As these become better understond, expand the types and look at adding them to @types/draggable
 */
export interface DraggableDraggedContext<ItemType> {
  // index: number;
  element: ItemType;
  // futureIndex: number;
}

export interface DraggableRelatedContext<ItemType> {
  // index: number;
  element: ItemType;
  // list: ItemType[];
  // component: Vue;
}

export interface DraggableMoveEvent<ItemType> {
  // isTrusted: boolean;
  // to: Element;
  // from: Element;
  // dragged: Element;
  // draggedRect: ClientRect;
  // related: Element;
  // relatedRect: ClientRect;
  // willInsertAfter: boolean;
  // originalEvent: DragEvent;
  relatedContext: DraggableRelatedContext<ItemType>;
  draggedContext: DraggableDraggedContext<ItemType>;
}

export interface DraggableEndEvent {
  oldIndex: number;
  newIndex: number;
}
