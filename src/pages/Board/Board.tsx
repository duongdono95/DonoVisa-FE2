import { useEffect } from 'react';
import './Board.scss';
import { useAppStore } from '../../stores/AppStore';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import BoardDrawer from './components/BoardDrawer';
import BoardBar from './components/BoardBar';
import BoardColumns from './components/BoardColumns';
import { Box, Button } from '@mui/material';
import { useBoardsStore } from '../../stores/BoardsStore';
import { GUEST_ID } from '../../types/GeneralTypes';
import { useQuery } from '@tanstack/react-query';
import { API_getBoard } from '../../hooks/API_functions';
import { Loader2 } from 'lucide-react';
import MarkdownCard from './components/MarkdownCard';

const Board = () => {
  const navigate = useNavigate();
  const [setBoard, boardList, board] = useBoardsStore((state) => [state.setBoard, state.boardList, state.board]);
  const { state } = useLocation();
  const [appBarHeight, boardBarHeight, user] = useAppStore((state) => [state.appBarHeight, state.boardBarHeight, state.user]);

  const { data, isLoading } = useQuery({
    queryKey: ['board'],
    queryFn: () => API_getBoard(state.boardId),
    retry: 3,
    enabled: user.firstName !== GUEST_ID && state.boardId ? true : false,
  });
  useEffect(() => {
    setBoard(null);
    if (user.firstName === GUEST_ID) {
      const board = boardList.find((b) => b.id === state.boardId);
      if (!board) return navigate(-1);
      setBoard(board);
    }
    if (user.firstName !== GUEST_ID && user._id && data) {
      if (data.code === 200) setBoard(data.data);
    }
  }, [data]);

  return (
    <div className="board-page">
      <MarkdownCard />
      <NavBar />
      <Box
        className="board-body"
        sx={{
          paddingTop: `${appBarHeight}px`,
        }}
      >
        <BoardDrawer />
        {board && !isLoading && (
          <Box className="board-content">
            <BoardBar />
            <BoardColumns boardBarHeight={boardBarHeight} />
          </Box>
        )}
        {!board && !isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>
              Board Not Found, please{' '}
              <Button variant="text" onClick={() => navigate(-1)}>
                click here
              </Button>{' '}
              to return the previous page
            </p>
          </Box>
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animated-rotation" />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Board;
