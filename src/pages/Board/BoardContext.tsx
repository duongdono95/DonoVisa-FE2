import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { BoardInterface } from '../../types/GeneralTypes';
import { useBoardsStore } from '../../stores/BoardsStore';

interface BoardContextInterface {
  board: BoardInterface | null;
  setBoard: React.Dispatch<React.SetStateAction<BoardInterface | null>>;
}
export const BoardContext = createContext<BoardContextInterface>({
  board: null,
  setBoard: () => {},
});

export const BoardContextProvider = ({ children }: PropsWithChildren<object>) => {
  const [boardList, setBoardList] = useBoardsStore((state) => [state.boardList, state.setBoardList]);
  const [board, setBoard] = useState<BoardInterface | null>(null);
  const contextValue = {
    board,
    setBoard,
  };

  useEffect(() => {
    if (boardList) setBoard(boardList[0]);
  }, [boardList]);
  return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>;
};

export const useBoardContext = (): BoardContextInterface => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDcontextProvider');
  }
  return context;
};
