import { useBoardsStore } from '../stores/BoardsStore';
import { BoardInterface, CardInterface, ColumnInterface } from '../types/GeneralTypes';

const demoFunction = () => {
  const [state] = useBoardsStore((state) => [state]);
};

const createBoard = () => {
  const [addBoard] = useBoardsStore((state) => [state.addBoard]);
  return (newBoard: BoardInterface) => addBoard(newBoard);
};

const updateBoard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (editedBoard: BoardInterface) => state.editBoard(editedBoard);
};

const deleteBoard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (board: BoardInterface) => state.deleteBoard(board);
};

const createColumn = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (column: ColumnInterface) => state.addColumn(column);
};

const editColumn = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (column: ColumnInterface) => state.editColumn(column);
};

const createCard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (card: CardInterface) => state.addCard(card);
};

const editCard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (card: CardInterface) => state.editCard(card);
};
export const boardFunctions = {
  createBoard,
  updateBoard,
  deleteBoard,
  createColumn,
  editColumn,
  createCard,
  editCard,
};
