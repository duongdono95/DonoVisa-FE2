import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createCollisionDetectionStrategy } from './CollisionDetectionTrategy';
import { findColumnById, findItembyId } from './DnDhooks';
import { unstable_batchedUpdates } from 'react-dom';

import { useDnD } from './DnDContext';
import { BoardInterface, CardInterface, ColumnInterface } from '../../../types/GeneralTypes';
import { randomId } from '../../../hooks/GeneralHooks';

interface Props {
  children: React.ReactNode;
  vertical?: boolean;
}
export const CREATE_NEW_ID = 'DndCreateNew';
export const TRASH_ID = 'DndTrash';
const DroppableContainer = ({ children, vertical }: Props) => {
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }), useSensor(TouchSensor));
  const {
    columns,
    setColumns,
    activeId,
    setActiveId,
    setIsDraggingToTrash,
    setRequestDeletingItem,
    setDragColumnEndEvent,
    setDragCardEndEvent,
    setHandleCreateNewItemEvent,
  } = useDnD();
  const [containerIdOrder, setContainerIdOrder] = useState<UniqueIdentifier[]>(columns.map((column) => column._id as string));
  const [clonedcontainers, setClonedContainers] = useState<ColumnInterface[] | null>(null);
  const [originalColumn, setOriginalColumn] = useState<ColumnInterface | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const collisionDetectionStrategy = useCallback(
    createCollisionDetectionStrategy({
      lastOverId,
      recentlyMovedToNewContainer,
    }),
    [activeId, containerIdOrder],
  );
  useEffect(() => {
    for (const column of columns) {
      if (column.cards) {
        column.cardOrderIds = column.cards.map((card) => card._id as string);
      }
    }
    if (columns) return setContainerIdOrder(columns.map((column) => column._id as string));
  }, [columns]);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => onDragCancel()}
    >
      <SortableContext items={[...containerIdOrder]} strategy={vertical ? verticalListSortingStrategy : horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
  // -----------------------------------------------------------------------------------------------------------------------------
  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
    setClonedContainers(columns);
    setRequestDeletingItem(null);
    const originalColumn = findColumnById(columns, active.id);
    if (originalColumn) setOriginalColumn(originalColumn);
  }
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!active || !over) return;
    if (over.id === TRASH_ID) {
      setIsDraggingToTrash(true);
    } else {
      setIsDraggingToTrash(false);
    }
    // -----------validate the active item, only card is allowed or over item !== trash
    if (!over.id || over.id === TRASH_ID || over.id === CREATE_NEW_ID || active.id in containerIdOrder) return;

    const activeColumn = findColumnById(columns, active.id);
    const overColumn = findColumnById(columns, over.id);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;
    if (activeColumn !== overColumn) {
      setColumns((containers) => {
        const clonedcontainers = [...containers];
        const activeColumnIndex = clonedcontainers.findIndex((column) => column._id === activeColumn._id);
        const overCardIndex = overColumn.cards.findIndex((card) => card._id === over.id);
        const overColumnIndex = clonedcontainers.findIndex((column) => column._id === overColumn._id);
        let newCardIndex: number;

        if (over.id in clonedcontainers) {
          newCardIndex = clonedcontainers.length + 1;
        } else {
          const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1;
        }
        recentlyMovedToNewContainer.current = true;

        clonedcontainers[activeColumnIndex] = {
          ...activeColumn,
          cards: activeColumn.cards.filter((card) => card._id !== active.id),
        };
        clonedcontainers[overColumnIndex] = {
          ...overColumn,
          cards: [
            ...overColumn.cards.slice(0, newCardIndex),
            ...activeColumn.cards.filter((card) => card._id === active.id),
            ...overColumn.cards.slice(newCardIndex),
          ],
        };
        return clonedcontainers;
      });
    }
    setContainerIdOrder(columns.map((column) => column._id as string));
  }
  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!active || !over) return;
    const activeItem = findItembyId(columns, active.id);
    if (!activeItem || !over.id) {
      setActiveId(null);
      return;
    }
    // check if dragged item is Column
    if ('cards' in activeItem) {
      // -------------- CREATE A NEW COLUMN ---------------
      if (over.id === CREATE_NEW_ID) {
        const newColumn: ColumnInterface = {
          ...activeItem,
          _id: `placeholder`,
          title: `Coppied - ${activeItem.title}`,
          cardOrderIds: activeItem.cards.map((card, index) => `placeholder - ${index}`),
          cards: activeItem.cards.map((card, index) => ({ ...card, _id: `placeholder - ${index}` })),
        };
        setColumns((prev) => [...prev, newColumn]);
        setHandleCreateNewItemEvent({ newColumn: newColumn, originalColumn: null, activeCard: null });
        setActiveId(null);
        setOriginalColumn(null);
        return;
      }

      // ---------------- MOVE A COLUMN ----------------
      setColumns((prev) => {
        const clonedcontainers = [...prev];
        const activeIndex = columns.findIndex((column) => column._id === active.id);
        const overIndex = columns.findIndex((column) => column._id === over.id);
        return arrayMove(clonedcontainers, activeIndex, overIndex);
      });
      setDragColumnEndEvent(true);
    }
    // ------------------------CARD -----------------------------
    const activeColumn = findColumnById(columns, active.id);
    if (!activeColumn) return;

    // if card is dragged to 'Create New' container
    if (over.id === CREATE_NEW_ID) {
      const activeCard = activeItem;
      if (!activeCard || !activeColumn) return;
      const activeCardIndex = activeColumn.cards.indexOf(activeCard as CardInterface);
      const activeColumnIndex = columns.indexOf(activeColumn as ColumnInterface);
      if (activeCardIndex === -1 || activeColumnIndex === -1) return;
      const newColumn: ColumnInterface = {
        _id: 'New Column',
        id: randomId(),
        ownerId: activeItem.ownerId,
        boardId: (activeItem as ColumnInterface).boardId,
        title: 'New Column',
        cardOrderIds: [activeCard._id as string],
        cards: [activeCard as CardInterface],
        _destroy: false,
        createdAt: new Date().toString(),
        updatedAt: null,
      };
      unstable_batchedUpdates(() =>
        setColumns((prev) => {
          const updatedOriginalColumn = {
            ...activeColumn,
            cards: activeColumn.cards.filter((card) => card._id !== activeCard._id),
          };

          const updatedContainers = prev.map((column, index) => (index === activeColumnIndex ? updatedOriginalColumn : column));
          return [...updatedContainers, newColumn];
        }),
      );
      setHandleCreateNewItemEvent({
        originalColumn: activeColumn,
        newColumn: newColumn,
        activeCard: { ...activeCard } as CardInterface,
      });
      setActiveId(null);
      setOriginalColumn(null);
      return;
    }
    // ---------------- DELETE A Card/Column ----------------
    if (over.id === TRASH_ID) {
      if ('cards' in activeItem) {
        setColumns((prev) => {
          const clonedColumns = [...prev];
          const filteredColumns = clonedColumns.filter((column) => column._id !== activeItem._id);
          return filteredColumns;
        });
      } else {
        setColumns((prev) =>
          prev.map((column) => {
            if (column._id === activeItem.columnId) {
              return { ...column, cards: column.cards.filter((card) => card._id !== active.id) };
            }
            return column;
          }),
        );
      }
      setRequestDeletingItem(activeItem);
      setIsDraggingToTrash(false);
    }
    // ---------------- MOVE A CARD ----------------
    if ('columnId' in activeItem && activeColumn && over.id && originalColumn) {
      const activeColumn = findColumnById(columns, over.id);
      if (!activeColumn) return;
      const activeIndex = activeColumn.cards.findIndex((card) => card.id === active.id);
      const overIndex = activeColumn.cards.findIndex((card) => card.id === over.id);
      setColumns((prev) => {
        const clonedColumn = [...prev];
        const activeColumnIndex = columns.findIndex((column) => column.id === activeColumn.id);
        if (activeColumnIndex === undefined) return clonedColumn;
        const newCardsOrder = arrayMove(clonedColumn[activeColumnIndex].cards, activeIndex, overIndex);
        clonedColumn[activeColumnIndex].cards = newCardsOrder;
        clonedColumn[activeColumnIndex].cardOrderIds = newCardsOrder.map((card) => card.id);
        return clonedColumn;
      });
      const originalCol = columns.find((column) => column.id === originalColumn.id);
      const movedCol = columns.find((column) => column.id === activeColumn.id);
      if (movedCol && originalCol)
        setDragCardEndEvent({ originalColumn: originalCol, movedColumn: movedCol, activeCard: { ...activeItem, columnId: movedCol.id } });
    }
    setActiveId(null);
    setOriginalColumn(null);
  }

  function onDragCancel() {
    if (clonedcontainers) return setClonedContainers(columns);
    setActiveId(null);
    setClonedContainers(null);
  }

  function handleRemove(columnId: UniqueIdentifier) {
    setColumns((containers) => containers.filter((column) => column.id !== columnId));
  }
};

export default DroppableContainer;
