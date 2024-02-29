import { useCallback, useRef, useState } from 'react';
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
import { useBoardsStore } from '../../../stores/BoardsStore';
import { useAppStore } from '../../../stores/AppStore';

interface Props {
  children: React.ReactNode;
  vertical?: boolean;
  board: BoardInterface;
}
export const CREATE_NEW_ID = 'DndCreateNew';
export const TRASH_ID = 'DndTrash';
const DroppableContainer = ({ children, vertical, board }: Props) => {
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }), useSensor(TouchSensor));
  const {
    activeId,
    setActiveId,
    setActiveItem,
    setIsDraggingToTrash,
    setRequestDeletingItem,
    setDragColumnEndEvent,
    setDragCardEndEvent,
    setHandleCreateNewItemEvent,
  } = useDnD();
  // -----------------------------------------------------------------------------------------------------------------------------
  const [editBoard] = useBoardsStore((state) => [state.editBoard]);
  const [user] = useAppStore((state) => [state.user]);
  const containerIdOrder = board ? board.columnOrderIds : [];
  const [startedColumn, setStartedColumn] = useState<ColumnInterface | null>(null);
  // -----------------------------------------------------------------------------------------------------------------------------
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const copiedBoard = board;
  const recentlyMovedToNewContainer = useRef(false);
  const collisionDetectionStrategy = useCallback(createCollisionDetectionStrategy(lastOverId, recentlyMovedToNewContainer, board), [
    activeId,
    containerIdOrder,
  ]);

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
    if (!board) return;
    const activeItem = findItembyId(board.columns, active.id);
    setActiveId(active.id as string);
    setActiveItem(activeItem);
    setRequestDeletingItem(null);
    const originalCol = findColumnById(board.columns, active.id);
    originalCol && setStartedColumn(originalCol);
  }
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!active || !over || !board || !user) return;
    if (over.id === TRASH_ID) {
      setIsDraggingToTrash(true);
    } else {
      setIsDraggingToTrash(false);
    }
    // -----------validate the active item, only card is allowed or over item !== trash && moving card between different columns -----------------------------
    if (!over.id || over.id === TRASH_ID || over.id === CREATE_NEW_ID || active.id in containerIdOrder) return;
    const activeColumn = findColumnById(board.columns, active.id);
    const overColumn = findColumnById(board.columns, over.id);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;
    if (activeColumn !== overColumn) {
      const clonedcontainers = [...board.columns];
      const activeColumnIndex = clonedcontainers.findIndex((column) => column.id === activeColumn.id);
      const overCardIndex = overColumn.cards.findIndex((card) => card.id === over.id);
      const overColumnIndex = clonedcontainers.findIndex((column) => column.id === overColumn.id);
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
        cards: activeColumn.cards.filter((card) => card.id !== active.id),
        cardOrderIds: activeColumn.cardOrderIds.filter((id) => id !== active.id),
      };
      clonedcontainers[overColumnIndex] = {
        ...overColumn,
        cards: [
          ...overColumn.cards.slice(0, newCardIndex),
          ...activeColumn.cards.filter((card) => card.id === active.id),
          ...overColumn.cards.slice(newCardIndex),
        ],
        cardOrderIds: [...clonedcontainers[overColumnIndex].cardOrderIds, active.id.toString()],
      };
      editBoard({ ...board, columns: clonedcontainers, columnOrderIds: clonedcontainers.map((c) => c.id), updatedAt: new Date().toISOString() });
    }
  }
  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!active || !over || !board || !user) return;
    console.log(startedColumn);
    const activeItem = findItembyId(board.columns, active.id);
    if (!activeItem || !over.id) return setActiveId(null);
    // check if dragged item is Column

    if ('cards' in activeItem) {
      // -------------- CREATE A NEW COLUMN ---------------
      const newCards = activeItem.cards.map((card) => ({ ...card, id: randomId(), createdAt: new Date().toISOString() }));
      if (over.id === CREATE_NEW_ID) {
        const newColumn: ColumnInterface = {
          id: randomId(),
          ownerId: user.id,
          title: `${activeItem.title} - Coppied`,
          boardId: board.id,
          cards: newCards,
          cardOrderIds: newCards.map((c) => c.id),
          createdAt: new Date().toISOString(),
          updatedAt: null,
          _destroy: false,
        };
        editBoard({ ...board, columns: [...board.columns, newColumn], columnOrderIds: [...board.columnOrderIds, newColumn.id] });
        setHandleCreateNewItemEvent({ newColumn: newColumn, originalColumn: null, activeCard: null });
        setActiveId(null);
        return;
      }

      // ---------------- MOVE A COLUMN ----------------
      const updatedBoard = { ...board };
      const activeIndex = board.columns.findIndex((column) => column.id === active.id);
      const overIndex = board.columns.findIndex((column) => column.id === over.id);
      const newColumns = arrayMove(updatedBoard.columns, activeIndex, overIndex);
      editBoard({ ...board, columns: newColumns, columnOrderIds: newColumns.map((column) => column.id) });
      setDragColumnEndEvent(true);
    }

    // ------------------------CARD -----------------------------
    const activeColumn = findColumnById(board.columns, active.id);
    if (!activeColumn) return;
    // if card is dragged to 'Create New' container
    if (over.id === CREATE_NEW_ID) {
      const activeCard = activeItem as CardInterface;
      if (!activeCard || !activeColumn || !startedColumn || startedColumn === null) return;

      const movedCard: CardInterface = {
        id: activeCard.id,
        ownerId: activeCard.ownerId,
        title: activeCard.title,
        columnId: activeCard.columnId,
        createdAt: new Date().toString(),
        updatedAt: null,
        _destroy: false,
        boardId: board.id,
      };
      const newColumn: ColumnInterface = {
        id: randomId(),
        ownerId: activeItem.ownerId,
        boardId: (activeItem as ColumnInterface).boardId,
        title: 'New Column',
        cardOrderIds: [movedCard.id as string],
        cards: [movedCard],
        _destroy: false,
        createdAt: new Date().toString(),
        updatedAt: null,
      };
      const updateHoverCol: ColumnInterface = {
        id: activeColumn.id,
        ownerId: activeColumn.ownerId,
        boardId: activeColumn.boardId,
        title: activeColumn.title,
        cards: activeColumn.cards.filter((card) => card.id !== activeCard.id),
        cardOrderIds: activeColumn.cardOrderIds.filter((c) => c !== activeCard.id),
        _destroy: false,
        createdAt: activeColumn.createdAt,
        updatedAt: new Date().toString(),
      };
      const updatedColumns = [
        ...board.columns.map((c) => (c.id === updateHoverCol.id ? updateHoverCol : c)),
        { ...newColumn, cards: [{ ...movedCard, columnId: newColumn.id }] },
      ];

      unstable_batchedUpdates(() =>
        editBoard({ ...board, columns: updatedColumns, columnOrderIds: updatedColumns.map((column) => column.id), updatedAt: new Date().toString() }),
      );

      const originalCol = board.columns.find((c) => c.id === startedColumn.id);
      originalCol &&
        setHandleCreateNewItemEvent({
          originalColumn: originalCol,
          newColumn: newColumn,
          activeCard: { ...movedCard, columnId: newColumn.id },
        });
      setActiveId(null);

      return;
    }
    // ---------------- DELETE A Card/Column ----------------
    if (over.id === TRASH_ID) {
      // DELETE A COLUMN
      if ('cards' in activeItem) {
        const editedColumns = board.columns.filter((column) => column.id !== activeItem.id);
        setRequestDeletingItem(activeItem);
        return editBoard({ ...board, columns: editedColumns, columnOrderIds: editedColumns.map((c) => c.id), updatedAt: new Date().toISOString() });
      }
      const updatedCards = activeColumn.cards.filter((c) => c.id !== activeItem.id);
      const updatedColumn = { ...activeColumn, cards: updatedCards, cardOrderIds: updatedCards.map((c) => c.id) };

      setRequestDeletingItem(activeItem);
      editBoard({
        ...board,
        columns: board.columns.map((c) => (c.id === updatedColumn.id ? updatedColumn : c)),
        updatedAt: new Date().toISOString(),
      });
      setIsDraggingToTrash(false);
    }

    // ---------------- MOVE A CARD ----------------
    if ('columnId' in activeItem && activeColumn && over.id && activeId && startedColumn) {
      const activeColumn = findColumnById(board.columns, over.id);
      if (!activeColumn) return;
      const activeColumnIndex = board.columns.findIndex((column) => column.id === activeColumn.id);
      const originalColumnIndex = board.columns.findIndex((column) => column.id === startedColumn.id);
      const activeCard = { ...activeItem, columnId: board.columns[activeColumnIndex].id };
      const clonedColumns = board.columns;
      if (activeColumnIndex !== originalColumnIndex) {
        clonedColumns[originalColumnIndex].cards = clonedColumns[originalColumnIndex].cards.filter((card) => card.id !== activeItem.id);
        clonedColumns[originalColumnIndex].cardOrderIds = clonedColumns[originalColumnIndex].cardOrderIds.filter((id) => id !== activeItem.id);
        clonedColumns[activeColumnIndex].cards = clonedColumns[activeColumnIndex].cards.map((card) =>
          card.id === activeCard.id ? activeCard : card,
        );
        editBoard({ ...board, columns: clonedColumns });
        setDragCardEndEvent({
          originalColumn: board.columns[originalColumnIndex],
          movedColumn: board.columns[activeColumnIndex],
          activeCard: activeCard,
        });
      }
      if (activeColumnIndex === originalColumnIndex) {
        const activeColumn = findColumnById(board.columns, over.id);
        if (!activeColumn) return;
        const activeIndex = activeColumn.cards.findIndex((card) => card.id === active.id);
        const overIndex = activeColumn.cards.findIndex((card) => card.id === over.id);
        const newCardsOrder = arrayMove(board.columns[activeColumnIndex].cards, activeIndex, overIndex);
        const updatedColumn: ColumnInterface = {
          ...activeColumn,
          cards: newCardsOrder,
          cardOrderIds: newCardsOrder.map((card) => card.id),
          updatedAt: new Date().toISOString(),
        };
        editBoard({ ...board, columns: board.columns.map((column) => (column.id === updatedColumn.id ? updatedColumn : column)) });
        setDragCardEndEvent({
          originalColumn: updatedColumn,
          movedColumn: updatedColumn,
          activeCard: activeCard,
        });
      }
    }
    setActiveId(null);
    setStartedColumn(null);
  }

  function onDragCancel() {
    editBoard(copiedBoard);
    setActiveId(null);
  }
};

export default DroppableContainer;
