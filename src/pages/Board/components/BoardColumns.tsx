/* eslint-disable react-hooks/exhaustive-deps */
import Column from './Column';
import { DragOverlay } from '@dnd-kit/core';
import { Box } from '@mui/material';
import Card from './Card';
import { createPortal } from 'react-dom';
import BoardTrashBin from './BoardTrashBin';
import CreateNewBox from './CreateNewBox';
import { CardInterface, ColumnInterface } from '../../../types/GeneralTypes';
import { useDnD } from '../DnD/DnDContext';
import { dropAnimation } from '../DnD/DnDhooks';
import DroppableContainer from '../DnD/DroppableContainer';
import { useBoardsStore } from '../../../stores/BoardsStore';

interface Props {
  boardBarHeight: number;
}

const BoardColumns = ({ boardBarHeight }: Props) => {
  const { activeItem, isDraggingToTrash } = useDnD();
  const [board] = useBoardsStore((state) => [state.board]);
  return (
    board && (
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
    )
  );
};

export default BoardColumns;
