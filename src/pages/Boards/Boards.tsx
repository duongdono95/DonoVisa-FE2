import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import './Boards.scss';
import { useAppStore } from '../../stores/AppStore';
import { Box, Button, Dialog, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoardInterface, GUEST_ID, VisibilityTypeEnum } from '../../types/GeneralTypes';
import { emptyBoard } from '../../utils/constants';
import { toast } from 'react-toastify';
import { Plus, Lock, Unlock, Pencil, MoreVertical, Trash } from 'lucide-react';
import DeleteBoard from './DeleteBoard';
import BoardForm from './BoardForm';
import { useBoardsStore } from '../../stores/BoardsStore';
const Boards = () => {
  const [appBarHeight, user] = useAppStore((state) => [state.appBarHeight, state.user]);
  const [boardList] = useBoardsStore((state) => [state.boardList]);
  const theme = useTheme();
  const navigate = useNavigate();
  const [boardMenu, setBoardMenu] = React.useState<null | HTMLElement>(null);
  const [openDiaglog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'confirmDelete' | null>(null);
  const [clickedBoard, setClickedBoard] = useState<BoardInterface | null>(null);
  const handleNavigate = (board: BoardInterface) => {
    navigate(`/boards/${board.slug}`, { state: { boardId: board.id } });
  };
  return (
    <div className="boards-page">
      <NavBar />
      <div className="boards-body" style={{ paddingTop: `${appBarHeight + 10}px` }}>
        <div className="workspaces">
          <h2
            style={{
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'var(--white05)' : 'var(--black05)'}`,
            }}
          >
            Your workspaces
          </h2>
          <Button
            variant="outlined"
            sx={{
              minWidth: '200px',
              maxWidth: '200px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onClick={() => {
              setOpenDialog(true);
              setDialogType('create');
              setClickedBoard({ ...emptyBoard, ownerId: user?.id ?? '' });
              user && user.firstName === GUEST_ID && toast.warning('Guest Mode - The Created Data will be saved for 24 hours.');
            }}
          >
            <Plus />
            Create New Board
          </Button>
          <div className="board-list">
            {boardList.map((board, index) => (
              <Box
                key={index}
                className="board"
                sx={{
                  backgroundColor: `var(--primary0${9 - index})`,
                }}
                onClick={() => handleNavigate(board)}
              >
                <div className="board-menu">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setBoardMenu(e.currentTarget);
                      setClickedBoard(board);
                    }}
                  >
                    <MoreVertical />
                  </IconButton>
                </div>
                <h3 className="title text-overflow">{board.title}</h3>
                <p className="description text-overflow">{board.description}</p>
                <div
                  className="visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {board.visibilityType === VisibilityTypeEnum.Private || board.visibilityType === VisibilityTypeEnum.OnlyMe ? <Lock /> : <Unlock />}
                </div>
              </Box>
            ))}
          </div>
          <Menu
            anchorEl={boardMenu}
            open={Boolean(boardMenu)}
            onClose={() => setBoardMenu(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <MenuItem
              onClick={() => {
                setBoardMenu(null);
                setOpenDialog(true);
                setDialogType('edit');
              }}
            >
              <Pencil size={15} style={{ marginRight: '10px' }} />
              Edit The Board
            </MenuItem>
            <MenuItem
              onClick={() => {
                setBoardMenu(null);
                setOpenDialog(true);
                setDialogType('confirmDelete');
              }}
            >
              <Trash size={15} style={{ marginRight: '10px' }} />
              Delete Board
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Dialog
        open={openDiaglog}
        onClose={() => {
          setOpenDialog(false);
          setDialogType(null);
          setClickedBoard(emptyBoard);
        }}
      >
        {dialogType === 'confirmDelete' ? (
          <DeleteBoard board={clickedBoard} setOpenDialog={setOpenDialog} setBoardMenu={setBoardMenu} />
        ) : (
          <BoardForm board={clickedBoard} type={dialogType} setOpenDialog={setOpenDialog} />
        )}
      </Dialog>
    </div>
  );
};

export default Boards;
