import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BoardInterface, CardInterface, ColumnInterface } from '../types/GeneralTypes';

interface BoardsState {
  boardList: BoardInterface[];
  board: BoardInterface | null;
}

interface SetBoardState {
  // ----------------------- Board ------------------------------- //
  setBoardList: (boards: BoardInterface[]) => void;
  addBoard: (board: BoardInterface) => void;
  setBoard: (board: BoardInterface | null) => void;
  editBoard: (board: BoardInterface) => void;
  deleteBoard: (board: BoardInterface) => void;
  // ----------------------- Column ------------------------------- //
  addColumn: (column: ColumnInterface) => void;
  editColumn: (column: ColumnInterface) => void;
  deleteColumn: (column: ColumnInterface) => void;
  // ----------------------- Card ------------------------------- //
  addCard: (card: CardInterface) => void;
  editCard: (card: CardInterface) => void;
}

export const useBoardsStore = create<BoardsState & SetBoardState>()(
  devtools(
    persist(
      (set) => ({
        // ----------------------- Board ------------------------------- //
        boardList: [],
        setBoardList: (boards: BoardInterface[]) => set(() => ({ boardList: boards })),
        addBoard: (newBoard: BoardInterface) => set((state) => ({ boardList: [...state.boardList, newBoard] })),
        editBoard: (editedBoard: BoardInterface) =>
          set((state) => ({
            boardList: state.boardList.map((b) => (b.id === editedBoard.id ? editedBoard : b)),
            board: editedBoard,
          })),
        deleteBoard: (requestedBoard: BoardInterface) => set((state) => ({ boardList: state.boardList.filter((b) => b.id !== requestedBoard.id) })),
        // ----------------------- Column ------------------------------- //
        board: null,
        setBoard: (board: BoardInterface | null) => set(() => ({ board: board })),
        addColumn: (newColumn: ColumnInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: [...state.board.columns, newColumn],
              columnOrderIds: [...state.board.columnOrderIds, newColumn.id],
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
        editColumn: (editedColumn: ColumnInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: state.board.columns.map((column) => (column.id === editedColumn.id ? editedColumn : column)),
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
        deleteColumn: (column: ColumnInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: state.board.columns.filter((column) => column.id !== column.id),
              columnOrderIds: state.board.columnOrderIds.filter((id) => id !== column.id),
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
        // ----------------------- Card ------------------------------- //
        addCard: (card: CardInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: [
                ...state.board.columns.map((column) =>
                  column.id === card.columnId
                    ? {
                        ...column,
                        cards: [...column.cards, card],
                        cardOrderIds: [...column.cardOrderIds, card.id],
                      }
                    : column,
                ),
              ],
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
        editCard: (card: CardInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: [
                ...state.board.columns.map((column) =>
                  column.id === card.columnId
                    ? {
                        ...column,
                        cards: column.cards.map((c) => (c.id === card.id ? card : c)),
                      }
                    : column,
                ),
              ],
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
        deleteCard: (card: CardInterface) =>
          set((state) => {
            if (!state.board) return state;
            const updatedBoard = {
              ...state.board,
              columns: [
                ...state.board.columns.map((column) =>
                  column.id === card.columnId
                    ? {
                        ...column,
                        cards: column.cards.map((c) => (c.id === card.id ? card : c)),
                      }
                    : column,
                ),
              ],
            };
            const updatedBoardList = state.boardList.map((board) => (board.id === updatedBoard.id ? updatedBoard : board));
            return {
              ...state,
              board: updatedBoard,
              boardList: updatedBoardList,
            };
          }),
      }),
      { name: 'DonoVista Board Store' },
    ),
  ),
);
