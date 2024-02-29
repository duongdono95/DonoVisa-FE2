/* eslint-disable react-hooks/exhaustive-deps */
import Column from './Column';
import { DragOverlay } from '@dnd-kit/core';
import { Box } from '@mui/material';
import Card from './Card';
import { createPortal } from 'react-dom';
import BoardTrashBin from './BoardTrashBin';
import CreateNewBox from './CreateNewBox';
import { BoardInterface, CardInterface, ColumnInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { useDnD } from '../DnD/DnDContext';
import { dropAnimation } from '../DnD/DnDhooks';
import DroppableContainer from '../DnD/DroppableContainer';
import { useBoardsStore } from '../../../stores/BoardsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_moveCard, API_updateBoard } from '../../../hooks/API_functions';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAppStore } from '../../../stores/AppStore';

interface Props {
  boardBarHeight: number;
}

const BoardColumns = ({ boardBarHeight }: Props) => {
  const { activeItem, isDraggingToTrash } = useDnD();
  const [board] = useBoardsStore((state) => [state.board]);
  const [user] = useAppStore((state) => [state.user]);
  const queryClient = useQueryClient();
  const { dragColumnEndEvent, setDragColumnEndEvent, dragCardEndEvent, setDragCardEndEvent, handleCreateNewItemEvent } = useDnD();
  // ------------------------------------------------- Move Column ------------------------------------------------
  const moveColumnsMutation = useMutation({
    mutationFn: (board: BoardInterface) => API_updateBoard(board),
    onSuccess: (result) => {
      if (result.code === 200) {
        setDragColumnEndEvent(null);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Re-Arrange columns failed');
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });

  useEffect(() => {
    if (dragColumnEndEvent && board && user.firstName !== GUEST_ID) {
      moveColumnsMutation.mutate(board);
    }
  }, [dragColumnEndEvent]);

  // ------------------------------------------------- Move Card ------------------------------------------------
  const moveCardMutation = useMutation({
    mutationFn: (data: { oriCol: ColumnInterface; movedCol: ColumnInterface; activeCard: CardInterface }) =>
      API_moveCard(data.oriCol, data.movedCol, data.activeCard),
    onSuccess: (result) => {
      if (result.code === 200) {
        setDragCardEndEvent(null);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Re-Arrange card failed');
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
  useEffect(() => {
    if (user.firstName !== GUEST_ID && dragCardEndEvent?.activeCard && dragCardEndEvent.movedColumn && dragCardEndEvent.originalColumn) {
      moveCardMutation.mutate({
        oriCol: dragCardEndEvent.originalColumn,
        movedCol: dragCardEndEvent.movedColumn,
        activeCard: dragCardEndEvent.activeCard,
      });
    }
  }, [dragCardEndEvent]);

  return board ? (
    <Box
      className="board-columns"
      sx={{
        padding: `${boardBarHeight + 20}px 3% 3% 3%`,
      }}
    >
      <DroppableContainer board={board} vertical={false}>
        <Box className={'column-group'} sx={{ display: 'flex', gap: '2%' }}>
          {board.columns.map((column, index) => {
            return (
              <Column key={index} column={column}>
                {column.cards.map((card, index) => {
                  return <Card key={index} card={card} />;
                })}
              </Column>
            );
          })}
          <CreateNewBox />
          {activeItem && <BoardTrashBin />}
        </Box>

        {createPortal(
          <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
            {activeItem &&
              ('cards' in activeItem ? (
                <Box className={isDraggingToTrash ? 'animated-tilt-shaking-fast' : undefined}>
                  <Column dragOverlay column={activeItem as ColumnInterface}>
                    {activeItem && (activeItem as ColumnInterface).cards.map((card, index) => <Card key={index} card={card} />)}
                  </Column>
                </Box>
              ) : (
                <Box className={isDraggingToTrash ? 'animated-tilt-shaking-fast' : undefined}>
                  <Card dragOverlay card={activeItem as CardInterface} />
                </Box>
              ))}
          </DragOverlay>,
          document.body,
        )}
      </DroppableContainer>
    </Box>
  ) : (
    <p>No Board was Found</p>
  );
};

export default BoardColumns;
