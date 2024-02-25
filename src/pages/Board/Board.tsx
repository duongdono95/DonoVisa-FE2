import React, { useEffect, useState } from 'react';
import './Board.scss';
import { useAppStore } from '../../stores/AppStore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import BoardDrawer from './components/BoardDrawer';
import BoardBar from './components/BoardBar';
import BoardColumns from './components/BoardColumns';
import { Box } from '@mui/material';
import { BoardContextProvider } from './BoardContext';

const Board = () => {
  const navigate = useNavigate();
  const [appBarHeight, boardBarHeight, user] = useAppStore((state) => [state.appBarHeight, state.boardBarHeight, state.user]);

  useEffect(() => {
    if (!user) navigate(-1);
  }, [user]);

  return (
    <BoardContextProvider>
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
    </BoardContextProvider>
  );
};

export default Board;
