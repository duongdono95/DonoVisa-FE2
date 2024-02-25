import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BoardInterface } from '../types/GeneralTypes';

interface BoardsState {
  boardList: BoardInterface[];
  board: BoardInterface | null;
}

interface SetBoardState {
  setBoardList: (boards: BoardInterface[]) => void;
  setBoard: (board: BoardInterface) => void;
}

export const useBoardsStore = create<BoardsState & SetBoardState>()(
  devtools(
    persist(
      (set) => ({
        boardList: [],
        setBoardList: (boards: BoardInterface[]) => set(() => ({ boardList: boards })),
        board: null,
        setBoard: (board: BoardInterface) => set(() => ({ board: board })),
      }),
      { name: 'DonoVista App Store' },
    ),
  ),
);
