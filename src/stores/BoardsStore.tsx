import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BoardInterface } from '../types/GeneralTypes';

interface BoardsState {
  storeBoardList: BoardInterface[];
  storeBoard: BoardInterface | null;
}

interface SetBoardState {
  setStoreBoardList: (boards: BoardInterface[]) => void;
  setStoreBoard: (board: BoardInterface) => void;
}

export const useBoardsStore = create<BoardsState & SetBoardState>()(
  devtools(
    persist(
      (set) => ({
        storeBoardList: [],
        setStoreBoardList: (boards: BoardInterface[]) => set(() => ({ storeBoardList: boards })),
        storeBoard: null,
        setStoreBoard: (board: BoardInterface) => set(() => ({ storeBoard: board })),
      }),
      { name: 'DonoVista Board Store' },
    ),
  ),
);
