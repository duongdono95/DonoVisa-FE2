import axios from 'axios';
import {
  SignUpFormInterface,
  SignInFormInterface,
  BoardInterface,
  ColumnSchema,
  GUEST_ID,
  ColumnInterface,
  CardInterface,
} from '../types/GeneralTypes';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDnD } from '../pages/Board/DnD/DnDContext';
import { useAppStore } from '../stores/AppStore';
import { randomId } from './GeneralHooks';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ----------------------------- BOARDS ---------------------------
export const API_getAllBoards = () => {
  const [user] = useAppStore((state) => [state.user]);
  const userId = user?._id ?? null;
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/boards/user/${userId}`);
      return data;
    },
    enabled: userId ? true : false,
  });
};

export const API_createBoard = ({ setOpenDialog }: { setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (board: BoardInterface) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/boards`, board);
      return response.data;
    },
    onSuccess: (result) => {
      console.log(result);
      result.code === 200 && toast.success('Create Board Successfully');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setOpenDialog && setOpenDialog(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Create Board Failed');
    },
  });
};

export const API_updateBoard = ({ setOpenDialog }: { setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (board: BoardInterface) => {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/boards/${board._id}`, board);
      return response.data;
    },
    onSuccess: (result) => {
      result.code === 200 && toast.success('Update Board Successfully');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setOpenDialog && setOpenDialog(false);
      return result;
    },
    onError: (error) => {
      console.log(error);
      toast.error('Update Board Failed');
    },
  });
};

export const API_deleteBoard = ({ setOpenDialog }: { setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/boards/${id}`);
      return response.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setOpenDialog && setOpenDialog(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Delete Board Failed');
    },
  });
};

export const API_getBoard = (id: string) => {
  return useQuery({
    queryKey: ['board'],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/boards/${id}`);
      return data;
    },
  });
};

// // // ----------------------------- COLUMNS ---------------------------\
interface API_createColumn_props {
  setIsExpanded?: (value: React.SetStateAction<boolean>) => void;
}
export const API_createColumn = ({ setIsExpanded }: API_createColumn_props) => {
  const queryClient = useQueryClient();
  const { localBoard } = useDnD();
  const [form, setForm] = useState<Omit<z.infer<typeof ColumnSchema>, '_id'>>({
    id: randomId(),
    ownerId: GUEST_ID,
    boardId: localBoard ? localBoard._id : '',
    title: 'Column Title ...',
    createdAt: '',
    updatedAt: null,
    _destroy: false,
    cards: [],
    cardOrderIds: [],
  });
  const createColumn = useMutation({
    mutationFn: async (column: Omit<ColumnInterface, '_id'>) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/columns`, column);
      return response.data;
    },
    onSuccess: () => {
      console.log('Create New Column Successfully');
      queryClient.invalidateQueries({ queryKey: ['board'] });
      setIsExpanded && setIsExpanded(false);
      setForm && form && setForm({ ...form, title: 'Column Title ...' });
    },
    onError: (error) => {
      console.log(error);
      toast.error('Create Column Failed');
    },
  });
  return {
    form: form,
    setForm: setForm,
    createColumn: createColumn,
  };
};

export const API_deleteItem = () => {
  const queryClient = useQueryClient();
  const { requestDeletingItem, setRequestDeletingItem, localBoard, setLocalBoard } = useDnD();
  const deleteColumn = useMutation({
    mutationFn: (requestDeletingItem: ColumnInterface) => {
      const response = axios.delete(`${import.meta.env.VITE_BASE_URL}/columns`, {
        data: {
          columnId: requestDeletingItem._id,
          boardId: requestDeletingItem.boardId,
        },
      });
      return response;
    },
    onSuccess: (result) => {
      console.log(result);
      queryClient.invalidateQueries({ queryKey: ['board'] });
      setRequestDeletingItem(null);
      toast.success('Column successfully deleted');
    },
    onError: (error) => {
      console.log(error);
      setLocalBoard(localBoard);
      toast.error('Failed to delete column');
    },
  });

  const deleteCard = useMutation({
    mutationFn: async (requestDeletingItem: CardInterface) => {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/cards`, {
        data: {
          cardId: requestDeletingItem._id,
          columnId: requestDeletingItem.columnId,
        },
      });
      return response.data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      toast.success('Card successfully deleted');
    },
    onError: (err) => {
      console.log(err);
      setLocalBoard(localBoard);
      toast.error('Failed to delete card');
    },
  });
  useEffect(() => {
    if (requestDeletingItem && 'cards' in requestDeletingItem) {
      deleteColumn.mutate(requestDeletingItem as ColumnInterface);
    }
    if (requestDeletingItem && 'columnId' in requestDeletingItem) {
      deleteCard.mutate(requestDeletingItem as CardInterface);
    }
  }, [requestDeletingItem]);
};

export const API_updateColumn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (column: ColumnInterface) => {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/columns/${column._id}`, column);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.code === 200) {
        toast.success('Column Updated Successfully');
        queryClient.invalidateQueries({ queryKey: ['board'] });
      }
    },
    onError: () => {
      toast.error('Column Update Failed');
    },
  });
};

export const API_arrangeColumns = () => {
  const queryClient = useQueryClient();
  const { localBoard, setLocalBoard, columns, dragColumnEndEvent, setDragColumnEndEvent } = useDnD();
  const updateBoard = useMutation({
    mutationFn: async (data: { id: string; board: BoardInterface }) => {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/boards/${data.id}`, data.board);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      setDragColumnEndEvent(null);
    },
    onError: (error) => {
      console.log(error);
      setLocalBoard(localBoard);
    },
  });

  useEffect(() => {
    if (localBoard && columns && dragColumnEndEvent) {
      updateBoard.mutate({
        id: localBoard._id,
        board: {
          ...localBoard,
          columns: columns,
          columnOrderIds: columns.map((column) => column._id),
        },
      });
    }
  }, [dragColumnEndEvent]);
};

export const API_duplicateItem = () => {
  const queryClient = useQueryClient();
  const { handleCreateNewItemEvent, setHandleCreateNewItemEvent } = useDnD();

  const createColumn = useMutation({
    mutationFn: async (column: ColumnInterface) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/columns/duplicateColumn`, {
        column: column,
      });
      return response.data;
    },
    onSuccess: () => {
      setHandleCreateNewItemEvent(null);
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });

  const createCard = useMutation({
    mutationFn: async (data: { originalColumn: ColumnInterface; newColumn: ColumnInterface; activeCard: CardInterface }) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/columns/duplicateCard`, {
        originalColumn: data.originalColumn,
        newColumn: data.newColumn,
        activeCard: data.activeCard,
      });
      return response.data;
    },
    onSuccess: () => {
      setHandleCreateNewItemEvent(null);
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });

  useEffect(() => {
    if (
      handleCreateNewItemEvent &&
      handleCreateNewItemEvent.newColumn &&
      handleCreateNewItemEvent.originalColumn &&
      handleCreateNewItemEvent.activeCard
    ) {
      return createCard.mutate({
        originalColumn: handleCreateNewItemEvent.originalColumn,
        newColumn: handleCreateNewItemEvent.newColumn,
        activeCard: handleCreateNewItemEvent.activeCard,
      });
    }
    if (handleCreateNewItemEvent && handleCreateNewItemEvent.newColumn) {
      return createColumn.mutate(handleCreateNewItemEvent.newColumn);
    }
  }, [handleCreateNewItemEvent]);
};

// // // ----------------------------- CARDS ---------------------------
export const API_createNewCard = ({
  column,
  setIsExpanded,
}: {
  column: ColumnInterface;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const { localBoard } = useDnD();
  const [form, setForm] = useState<Omit<CardInterface, '_id'>>({
    id: randomId(),
    ownerId: GUEST_ID,
    columnId: column._id,
    title: 'Card Title ...',
    _destroy: false,
    createdAt: new Date().toString(),
    updatedAt: null,
  });
  const createCard = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cards`, form);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['board'] });
        toast.success('Card Created Successfully');
        setForm({ ...form, title: 'Card Title ...' });
        setIsExpanded(false);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Create Card Failed');
    },
  });

  return {
    form: form,
    setForm: setForm,
    createCard: createCard,
  };
};

export const API_updateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (card: CardInterface) => {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/${card._id}`, card);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['board'] });
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Update Card Failed');
    },
  });
};

export const API_arrangeCards = () => {
  const queryClient = useQueryClient();
  const { localBoard, setLocalBoard, columns, dragCardEndEvent, setDragCardEndEvent } = useDnD();
  const arrangeColumns = useMutation({
    mutationFn: async (data: { originalColumn: ColumnInterface; overColumn: ColumnInterface; activeCard: CardInterface }) => {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/columns/`, {
        originalColumn: data.originalColumn,
        overColumn: data.overColumn,
        activeCard: data.activeCard,
      });
      return response.data;
    },
    onSuccess: (result) => {
      if (result.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['board'] });
        setDragCardEndEvent(null);
      }
    },
    onError: (err) => {
      console.error(err);
      setLocalBoard(localBoard);
      toast.error('Failed to arrange columns');
    },
  });
  useEffect(() => {
    if (localBoard && columns && dragCardEndEvent && dragCardEndEvent.originalColumn && dragCardEndEvent.movedColumn && dragCardEndEvent.activeCard) {
      arrangeColumns.mutate({
        originalColumn: dragCardEndEvent.originalColumn,
        overColumn: dragCardEndEvent.movedColumn,
        activeCard: dragCardEndEvent.activeCard,
      });
    }
  }, [dragCardEndEvent]);
};

export const API_AuthSignUp = ({
  setError,
}: {
  setError?: React.Dispatch<
    React.SetStateAction<{
      path: string;
      message: string;
    }>
  >;
}) => {
  const navigate = useNavigate();
  const [setUser] = useAppStore((state) => [state.setUser]);
  return useMutation({
    mutationFn: async (data: SignUpFormInterface) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/sign-up`, data);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.data.code === 200) {
        setUser(result.data.data);
        navigate('/boards');
      } else if (result.data.code === 300) {
        setError && setError({ message: result.data.message, path: result.data.path });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const API_AuthSignIn = ({
  setError,
}: {
  setError: React.Dispatch<
    React.SetStateAction<{
      path: string;
      message: string;
    }>
  >;
}) => {
  const navigate = useNavigate();
  const [setUser] = useAppStore((state) => [state.setUser]);
  return useMutation({
    mutationFn: async (data: SignInFormInterface) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/sign-in`, data);
      return response.data;
    },
    onSuccess: (result) => {
      console.log(result);
      if (result.data.code === 200) {
        setUser(result.data.data);
        navigate('/boards');
      } else if (result.data.code === 300) {
        setError({ message: result.data.message, path: result.data.path });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
