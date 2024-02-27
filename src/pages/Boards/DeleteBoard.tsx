import React from 'react';
import { Button } from '@mui/material';
import { BoardInterface } from '../../types/GeneralTypes';
import { useBoardsStore } from '../../stores/BoardsStore';
import { boardFunctions } from '../../hooks/boardFunctions';

interface Props {
  board: BoardInterface | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardMenu: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function DeleteBoard({ board, setOpenDialog, setBoardMenu }: Props) {
  const [boardList, setBoardList] = useBoardsStore((state) => [state.boardList, state.setBoardList]);
  const deleteBoard = boardFunctions.deleteBoard();
  const handledeleteBoard_API = async () => {
    if (!board) return;
    deleteBoard(board);
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
          <Button color={'secondary'} onClick={handledeleteBoard_API}>
            Delete
          </Button>
        </div>
      </div>
    )
  );
}
