import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { findItembyId } from './DnDhooks';
import { CardInterface, ColumnInterface } from '../../../types/GeneralTypes';
import { useBoardContext } from '../BoardContext';

interface DnDContextInterface {
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  activeItem: ColumnInterface | CardInterface | null;
  setActiveItem: React.Dispatch<React.SetStateAction<ColumnInterface | CardInterface | null>>;
  isDraggingToTrash: boolean;
  setIsDraggingToTrash: (isDragging: boolean) => void;
  isSortingColumn: boolean | null;
  setIsSortingColumn: React.Dispatch<React.SetStateAction<boolean | null>>;
  requestDeletingItem: ColumnInterface | CardInterface | null;
  setRequestDeletingItem: React.Dispatch<React.SetStateAction<ColumnInterface | CardInterface | null>>;
  dragColumnEndEvent: boolean | null;
  setDragColumnEndEvent: React.Dispatch<React.SetStateAction<boolean | null>>;
  dragCardEndEvent: {
    originalColumn: ColumnInterface | null;
    movedColumn: ColumnInterface | null;
    activeCard: CardInterface | null;
  } | null;
  setDragCardEndEvent: React.Dispatch<
    React.SetStateAction<{
      originalColumn: ColumnInterface | null;
      movedColumn: ColumnInterface | null;
      activeCard: CardInterface | null;
    } | null>
  >;
  handleCreateNewItemEvent: {
    originalColumn: null | ColumnInterface;
    newColumn: ColumnInterface | null;
    activeCard: CardInterface | null;
  } | null;
  setHandleCreateNewItemEvent: React.Dispatch<
    React.SetStateAction<{
      originalColumn: null | ColumnInterface;
      newColumn: ColumnInterface | null;
      activeCard: CardInterface | null;
    } | null>
  >;
  openCardDialog: boolean;
  setOpenCardDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
export const DnDContext = createContext<DnDContextInterface>({
  activeId: null,
  setActiveId: () => {},

  activeItem: null,
  setActiveItem: () => {},

  isDraggingToTrash: false,
  setIsDraggingToTrash: () => {},

  isSortingColumn: null,
  setIsSortingColumn: () => {},

  requestDeletingItem: null,
  setRequestDeletingItem: () => {},

  dragColumnEndEvent: null,
  setDragColumnEndEvent: () => {},

  dragCardEndEvent: null,
  setDragCardEndEvent: () => {},

  handleCreateNewItemEvent: null,
  setHandleCreateNewItemEvent: () => {},

  openCardDialog: false,
  setOpenCardDialog: () => {},
});

export const DnDcontextProvider = ({ children }: PropsWithChildren<object>) => {
  const { board } = useBoardContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ColumnInterface | CardInterface | null>(null);

  const [isDraggingToTrash, setIsDraggingToTrash] = useState<boolean>(false);

  const [isSortingColumn, setIsSortingColumn] = useState<boolean | null>(null);

  const [requestDeletingItem, setRequestDeletingItem] = useState<ColumnInterface | CardInterface | null>(null);

  const [dragColumnEndEvent, setDragColumnEndEvent] = useState<boolean | null>(null);
  const [dragCardEndEvent, setDragCardEndEvent] = useState<{
    originalColumn: ColumnInterface | null;
    movedColumn: ColumnInterface | null;
    activeCard: CardInterface | null;
  } | null>(null);

  const [handleCreateNewItemEvent, setHandleCreateNewItemEvent] = useState<{
    originalColumn: null | ColumnInterface;
    newColumn: ColumnInterface | null;
    activeCard: CardInterface | null;
  } | null>(null);

  const [openCardDialog, setOpenCardDialog] = useState(false);

  const contextValue = {
    activeId,
    setActiveId,
    activeItem,
    setActiveItem,
    isDraggingToTrash,
    setIsDraggingToTrash,
    isSortingColumn,
    setIsSortingColumn,
    requestDeletingItem,
    setRequestDeletingItem,
    dragColumnEndEvent,
    setDragColumnEndEvent,
    dragCardEndEvent,
    setDragCardEndEvent,
    handleCreateNewItemEvent,
    setHandleCreateNewItemEvent,
    openCardDialog,
    setOpenCardDialog,
  };

  useEffect(() => {
    if (activeId !== null) {
      setActiveItem(board && findItembyId(board.columns, activeId));
    } else {
      setActiveItem(null);
    }
  }, [activeId, board]);

  useEffect(() => {
    if (activeItem && 'cards' in activeItem) {
      setIsSortingColumn(true);
    } else {
      setIsSortingColumn(false);
    }
  }, [activeItem]);
  return <DnDContext.Provider value={contextValue}>{children}</DnDContext.Provider>;
};

export const useDnD = (): DnDContextInterface => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDcontextProvider');
  }
  return context;
};
