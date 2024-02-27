import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDnD } from '../DnD/DnDContext';
import NewCardForm from './NewCardForm';
import { animateLayoutChanges } from '../DnD/DnDhooks';
import TextFieldComponent from '../../../components/TextFieldComponent';
import { ColumnInterface } from '../../../types/GeneralTypes';
import { boardFunctions } from '../../../hooks/boardFunctions';

interface ColumnProps {
  column: ColumnInterface;
  children?: React.ReactNode;
  dragOverlay?: boolean;
}

const Column = ({ column, children, dragOverlay }: ColumnProps) => {
  const theme = useTheme();
  const { attributes, isDragging, listeners, setNodeRef, transition, transform } = useSortable({
    id: column.id as string,
    data: Column,
    animateLayoutChanges,
  });
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'pointer' : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const { isDraggingToTrash, openCardDialog } = useDnD();
  const [isExpanded, setIsExpanded] = useState(false);
  const editColumn = boardFunctions.EditColumn();
  const handleSubmit = (data: ColumnInterface) => {
    editColumn(data);
  };
  return (
    <Box
      {...(openCardDialog ? undefined : listeners)}
      {...attributes}
      ref={setNodeRef}
      className={'board-column'}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? 'var(--white02)' : 'var(--black02)',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        overFlow: 'hidden',
        padding: '10px 5px 10px 5px',
        '&:hover': {
          boxShadow: dragOverlay ? `5px 5px 10px ${theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)'}` : 'none',
        },
        transform: dragOverlay && isDraggingToTrash ? 'scale(0.5)' : undefined,
        boxShadow: dragOverlay && isDraggingToTrash ? '2px 2px 20px rgba(255, 0, 0, 0.5)' : undefined,
      }}
      style={dndKitColumnStyles}
    >
      <Box sx={{ padding: '10px 10px 10px 15px' }}>
        <TextFieldComponent data={column} handleSubmit={handleSubmit} />
      </Box>
      <SortableContext items={column.cards.map((card) => card.id as string)} strategy={verticalListSortingStrategy}>
        <Box
          className="card-list"
          sx={{
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowX: 'hidden',
            overflowY: 'scroll',
            padding: '0 5px 10px 10px',
          }}
        >
          {children}
        </Box>
      </SortableContext>
      {isExpanded ? (
        <NewCardForm isExpanded={isExpanded} setIsExpanded={setIsExpanded} column={column} />
      ) : (
        <Button sx={{ borderRadius: '8px', marginTop: '10px', margin: '10px' }} variant={'contained'} onClick={() => setIsExpanded(!isExpanded)}>
          Create New Card
        </Button>
      )}
    </Box>
  );
};

export default Column;
