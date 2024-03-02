import { Avatar, AvatarGroup, Badge, Box, Button, TextField, Tooltip, useTheme } from '@mui/material';
import { Star, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CrownBadge, useDivSizeThroughRef } from '../../../hooks/GeneralHooks';
import { toast } from 'react-toastify';
import { BoardInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { useAppStore } from '../../../stores/AppStore';
import { useBoardsStore } from '../../../stores/BoardsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_updateBoard } from '../../../hooks/API_functions';

const BoardBar = () => {
  const theme = useTheme();
  const [board, setBoard] = useBoardsStore((state) => [state.board, state.setBoard]);
  const boardBarRef = useRef<HTMLDivElement>(null);
  const boardBarHeight = useDivSizeThroughRef(boardBarRef, 'height');
  const [setBoardBarHeight] = useAppStore((state) => [state.setBoardBarHeight]);
  const [user] = useAppStore((state) => [state.user]);
  const [localBoard, setLocalBoard] = useState(board);
  const [isStarred, setIsStarred] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const queryClient = useQueryClient();
  const handleInvite = () => {
    if (user && user.firstName === GUEST_ID) {
      toast.warning('Please Sign In to continue the action!');
    }
  };
  useEffect(() => {
    boardBarHeight && setBoardBarHeight(boardBarHeight);
  }, [boardBarHeight, setBoardBarHeight]);
  const updateBoardMutation = useMutation({
    mutationFn: (board: BoardInterface) => API_updateBoard(board),
    onSuccess: (result) => {
      console.log(result);
      setBoard(result.data);
      queryClient.invalidateQueries({ queryKey: ['board', 'boards'] });
    },
    onError: (err) => {
      console.log(err);
      toast.error('Update Board Failed');
    },
  });
  const handleUpdateBoard = () => {
    if (user.firstName === GUEST_ID && localBoard) {
      setBoard(localBoard);
    }
    if (user.firstName !== GUEST_ID && localBoard) {
      updateBoardMutation.mutate(localBoard);
    }
  };
  useEffect(() => {
    setLocalBoard(board);
  }, [board]);

  return (
    localBoard && (
      <Box className="board-bar" ref={boardBarRef} sx={{ bgcolor: theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)' }}>
        <Box className="left">
          <Star
            size={20}
            className="hover-transform-scale"
            fill={isStarred ? 'var(--warning)' : 'rgba(0,0,0,0)'}
            stroke={'var(--warning)'}
            onClick={() => setIsStarred(!isStarred)}
            style={{ cursor: 'pointer' }}
          />
          <TextField
            inputProps={{
              style: { fontSize: 16, padding: '3px 5px 0 5px', cursor: 'pointer' },
            }}
            InputProps={{
              disableUnderline: isReadOnly,
              readOnly: isReadOnly,
            }}
            fullWidth
            value={localBoard.title}
            onChange={(e) => setLocalBoard({ ...localBoard, title: e.target.value })}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                setIsReadOnly(true);
                handleUpdateBoard();
              }
            }}
            onDoubleClick={() => setIsReadOnly(false)}
            onBlur={() => {
              setIsReadOnly(true);
              handleUpdateBoard();
            }}
            variant={'standard'}
            size={'small'}
          />
        </Box>
        <Box className="right">
          <AvatarGroup max={4}>
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              badgeContent={<CrownBadge />}
            >
              <Tooltip title={user?.firstName === GUEST_ID ? 'Guest' : user?.firstName}>
                <Avatar
                  sizes="small"
                  alt={user?.firstName}
                  src={user?.firstName.toUpperCase()}
                  sx={{
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Tooltip>
            </Badge>
            {localBoard.memberIds.map((index) => {
              return (
                <Avatar
                  key={index}
                  sizes="small"
                  alt={'test'}
                  src={'test'}
                  sx={{
                    backdropFilter: 'blur(10px)',
                  }}
                />
              );
            })}
          </AvatarGroup>
          <Button variant="outlined" color={'primary'} size="small" sx={{ gap: '5px' }} onClick={() => handleInvite()}>
            <UserPlus size={16} strokeWidth={2.5} />
            Invite
          </Button>
        </Box>
      </Box>
    )
  );
};

export default BoardBar;
