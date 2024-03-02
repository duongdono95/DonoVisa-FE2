import React from 'react';
import { Button } from '@mui/material';
import { BoardInterface, GUEST_ID } from '../../types/GeneralTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_deleteBoard } from '../../hooks/API_functions';
import { useAppStore } from '../../stores/AppStore';
import { useBoardsStore } from '../../stores/BoardsStore';

interface Props {
  board: BoardInterface | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardMenu: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function DeleteBoard({ board, setOpenDialog, setBoardMenu }: Props) {
  const [user] = useAppStore((state) => [state.user]);
  const [deleteBoard, setBoard] = useBoardsStore((state) => [state.deleteBoard, state.setBoard, state.boardList]);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (_id: string) => API_deleteBoard(_id),
    onSuccess: (result) => result.code === 200 && queryClient.invalidateQueries({ queryKey: ['boards'] }),
    onError: (err) => console.log(err),
  });
  const handledeleteBoard = () => {
    if (!board || !user) return;
    if (user._id === GUEST_ID) {
      deleteBoard(board);
    }
    if (user._id !== GUEST_ID && board._id) {
      deleteBoard(board);
      setBoard(null);
      deleteMutation.mutate(board._id);
    }
    // --------------------------------------------------------------------- //
    setOpenDialog(false);
    setBoardMenu(null);
  };
  return (
    board && (
      <div className={'board-confirm-deletion-modal'}>
        <p className={'title'}>
          Are you sure you want to delete board - <b>{board.title}</b>?
        </p>
        <div className="reminder">
          <p>The Board and all the relevant files will be deleted</p>
          <p>This action cannot be undone</p>
        </div>
        <div className="buttons">
          <Button variant={'outlined'} onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button color={'secondary'} onClick={handledeleteBoard}>
            Delete
          </Button>
        </div>
      </div>
    )
  );
}
