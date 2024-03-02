/* eslint-disable react-hooks/rules-of-hooks */
import {
  CollisionDetection,
  UniqueIdentifier,
  closestCenter,
  closestCorners,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { findColumnById } from './DnDhooks';

import { useDnD } from './DnDContext';
import { CREATE_NEW_ID, TRASH_ID } from './DroppableContainer';
import { BoardInterface } from '../../../types/GeneralTypes';

export const createCollisionDetectionStrategy = (
  lastOverId: React.MutableRefObject<UniqueIdentifier | null>,
  recentlyMovedToNewContainer: React.MutableRefObject<boolean>,
  boards: BoardInterface,
) => {
  const { activeId } = useDnD();
  const containerIdOrder = boards.columns.map((container) => container._id);
  const collisionDetectionStrategy: CollisionDetection = (args) => {
    // --------------------------------- find the overId ------------------------------------------
    const pointerIntersections = pointerWithin(args);
    const intersections =
      pointerIntersections.length > 0
        ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
        : rectIntersection(args);
    let overId = getFirstCollision(intersections, 'id');

    // --------------------------------- collision detection logic from here ----------------------
    // Finding Droppable Intersection for the COLUMN
    if (overId && activeId && containerIdOrder.includes(activeId as string)) {
      if (overId === CREATE_NEW_ID || overId === TRASH_ID) {
        return [{ id: overId }];
      }
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) => containerIdOrder.includes(container.id as string)),
      });
    }

    // Finding Droppable Intersection for the CARD
    if (overId) {
      if (overId === TRASH_ID) {
        return intersections;
      }
      if (overId === CREATE_NEW_ID) {
        return intersections;
      }
      if (containerIdOrder.includes(overId as string)) {
        const column = findColumnById(boards.columns, overId);
        if (column && column.cards.length > 0) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && column.cardOrderIds.includes(container.id as string),
            ),
          })[0]?.id;
        }
      }

      lastOverId.current = overId;
      return [{ id: overId }];
    }

    if (recentlyMovedToNewContainer.current) {
      lastOverId.current = activeId;
    }
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  };
  return collisionDetectionStrategy;
};
