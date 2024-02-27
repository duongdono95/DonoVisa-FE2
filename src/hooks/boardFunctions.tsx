import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../stores/AppStore';
import { useBoardsStore } from '../stores/BoardsStore';
import { BoardInterface, CardInterface, ColumnInterface, GUEST_ID } from '../types/GeneralTypes';
import { toast } from 'react-toastify';
import axios from 'axios';

// const demoFunction = () => {
//   const [state] = useBoardsStore((state) => [state]);
// };

const CreateBoard = (setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [boardList, setBoardList] = useBoardsStore((state) => [state.boardList, state.setBoardList]);
  const clonedBoard = boardList;
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
      setBoardList(clonedBoard);
    },
  });
};

const UpdateBoard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (editedBoard: BoardInterface) => state.editBoard(editedBoard);
};

const DeleteBoard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (board: BoardInterface) => state.deleteBoard(board);
};

const CreateColumn = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (column: ColumnInterface) => state.addColumn(column);
};

const EditColumn = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (column: ColumnInterface) => state.editColumn(column);
};

const CreateCard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (card: CardInterface) => state.addCard(card);
};

const EditCard = () => {
  const [state] = useBoardsStore((state) => [state]);
  return (card: CardInterface) => state.editCard(card);
};
export const boardFunctions = {
  CreateBoard,
  UpdateBoard,
  DeleteBoard,
  CreateColumn,
  EditColumn,
  CreateCard,
  EditCard,
};
