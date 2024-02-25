import { DropAnimation, UniqueIdentifier, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import { AnimateLayoutChanges, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { ColumnInterface } from '../../../types/GeneralTypes';

export const findColumnById = (columns: ColumnInterface[], id: UniqueIdentifier) => {
  for (const column of columns) {
    if (column.id === id) {
      return column;
    }
    for (const card of column.cards) {
      if (card.id === id) {
        return column;
      }
    }
  }
};
export const findItembyId = (columns: ColumnInterface[], id: UniqueIdentifier) => {
  for (const column of columns) {
    if (column.id === id) {
      return column;
    }
    for (const card of column.cards) {
      if (card.id === id) {
        return card;
      }
    }
  }
  return null;
};
export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({
    ...args,
    wasDragging: true,
  });
