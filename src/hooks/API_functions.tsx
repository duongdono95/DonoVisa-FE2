import axios from 'axios';
import { BoardInterface, CardInterface, ColumnInterface } from '../types/GeneralTypes';

// ------------------------------ BOARD ---------------------------------- //
export const API_createBoard = async (board: BoardInterface) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/boards`, board);
  return response.data;
};

export const API_getBoards = async (userId: string) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/boards`, {
    params: {
      userId: userId,
    },
  });
  return response.data;
};

export const API_updateBoard = async (board: BoardInterface) => {
  const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/boards/${board._id}`, board);
  return response.data;
};

export const API_deleteBoard = async (_id: string) => {
  const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/boards/${_id}`);
  return response.data;
};

export const API_getBoard = async (_id: string) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/boards/${_id}`);
  return response.data;
};

// ------------------------------ COLUMN ---------------------------------- //
export const API_createColumn = async (column: ColumnInterface) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/columns`, column);
  return response.data;
};

export const API_editColumn = async (column: ColumnInterface) => {
  const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/columns/${column._id}`, column);
  return response.data;
};

export const API_deleteColumn = async (columnId: string) => {
  console.log('test');
  const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/columns/${columnId}`);
  return response.data;
};
// ------------------------------ CARD ---------------------------------- //
export const API_createCard = async (card: CardInterface) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cards`, card);
  return response.data;
};

export const API_editCard = async (card: CardInterface) => {
  const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/${card._id}`, card);
  return response.data;
};

export const API_deleteCard = async (cardId: string) => {
  const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/cards/${cardId}`);
  return response.data;
};

export const API_moveCard = async (oriCol: ColumnInterface, movedCol: ColumnInterface, activeCard: CardInterface) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/moving`, {
    originalColumn: oriCol,
    movedColumn: movedCol,
    activeCard: activeCard,
  });
  return response.data;
};

export const API_duplicate = async (originalColumn: null | ColumnInterface, newColumn: ColumnInterface | null, activeCard: CardInterface | null) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/boards/duplicate`, {
    originalColumn: originalColumn,
    newColumn: newColumn,
    activeCard: activeCard,
  });
  return response.data;
};
// ------------------------------ MARKDOWN ---------------------------------- //
