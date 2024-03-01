import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { CardInterface, ColumnInterface } from '../../../types/GeneralTypes';

interface DnDContextInterface {
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  activeItem: ColumnInterface | CardInterface | null;
  setActiveItem: React.Dispatch<React.SetStateAction<ColumnInterface | CardInterface | null>>;
  isDraggingToTrash: boolean;
  setIsDraggingToTrash: (isDragging: boolean) => void;
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
  handleCreateNewItemEvent: ColumnInterface | null;
  setHandleCreateNewItemEvent: React.Dispatch<React.SetStateAction<ColumnInterface | null>>;
}
export const DnDContext = createContext<DnDContextInterface>({
  activeId: null,
  setActiveId: () => {},

  activeItem: null,
  setActiveItem: () => {},

  isDraggingToTrash: false,
  setIsDraggingToTrash: () => {},

  requestDeletingItem: null,
  setRequestDeletingItem: () => {},

  dragColumnEndEvent: null,
  setDragColumnEndEvent: () => {},

  dragCardEndEvent: null,
  setDragCardEndEvent: () => {},

  handleCreateNewItemEvent: null,
  setHandleCreateNewItemEvent: () => {},
});

export const DnDcontextProvider = ({ children }: PropsWithChildren<object>) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ColumnInterface | CardInterface | null>(null);

  const [isDraggingToTrash, setIsDraggingToTrash] = useState<boolean>(false);

  const [requestDeletingItem, setRequestDeletingItem] = useState<ColumnInterface | CardInterface | null>(null);

  const [dragColumnEndEvent, setDragColumnEndEvent] = useState<boolean | null>(null);
  const [dragCardEndEvent, setDragCardEndEvent] = useState<{
    originalColumn: ColumnInterface | null;
    movedColumn: ColumnInterface | null;
    activeCard: CardInterface | null;
  } | null>(null);

  const [handleCreateNewItemEvent, setHandleCreateNewItemEvent] = useState<ColumnInterface | null>(null);

  const contextValue = {
    activeId,
    setActiveId,
    activeItem,
    setActiveItem,
    isDraggingToTrash,
    setIsDraggingToTrash,
    requestDeletingItem,
    setRequestDeletingItem,
    dragColumnEndEvent,
    setDragColumnEndEvent,
    dragCardEndEvent,
    setDragCardEndEvent,
    handleCreateNewItemEvent,
    setHandleCreateNewItemEvent,
  };

  return <DnDContext.Provider value={contextValue}>{children}</DnDContext.Provider>;
};

export const useDnD = (): DnDContextInterface => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDcontextProvider');
  }
  return context;
};
