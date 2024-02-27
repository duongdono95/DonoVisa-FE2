import React, { useEffect } from 'react';
import './Board.scss';
import { useAppStore } from '../../stores/AppStore';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import BoardDrawer from './components/BoardDrawer';
import BoardBar from './components/BoardBar';
import BoardColumns from './components/BoardColumns';
import { Box } from '@mui/material';
import { useBoardsStore } from '../../stores/BoardsStore';

const Board = () => {
  const navigate = useNavigate();
  const [setBoard, boardList, board] = useBoardsStore((state) => [state.setBoard, state.boardList, state.board]);
  const { state } = useLocation();
  const [appBarHeight, boardBarHeight, user] = useAppStore((state) => [state.appBarHeight, state.boardBarHeight, state.user]);
  useEffect(() => {
    if (!user || !boardList[0]) navigate(-1);
  }, [user, boardList[0]]);
  useEffect(() => {
    if (boardList) {
      const board = boardList.find((b) => b.id === state.boardId);
      if (!board) return navigate(-1);
      setBoard(board);
    }
  }, [boardList]);
  return (
    <div className="board-page">
      <NavBar />
      <Box
        className="board-body"
        sx={{
          paddingTop: `${appBarHeight}px`,
        }}
      >
        <BoardDrawer />
        <Box className="board-content">
          <BoardBar />
          <BoardColumns boardBarHeight={boardBarHeight} />
        </Box>
      </Box>
    </div>
  );
};

export default Board;
