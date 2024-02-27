import React from 'react';

import { Box, useTheme } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';
import { TRASH_ID } from '../DnD/DroppableContainer';

const BoardTrashBin = () => {
  const { attributes, listeners, setNodeRef, isOver } = useSortable({
    id: TRASH_ID,
  });
  const theme = useTheme();

  return (
    <Box
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      sx={{
        position: 'absolute',
        left: 0,
        bottom: '5%',
        width: '100vw',
        animation: isOver ? 'scale 2s linear infinite' : undefined,
      }}
    >
      <Box
        sx={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          bgcolor: `${theme.palette.mode === 'dark' ? 'var(--white01)' : undefined}`,
          boxShadow: `3px 3px 10px ${theme.palette.mode === 'dark' ? 'var(--white03)' : 'var(--black05)'}`,
        }}
      >
        <Trash2 size={40} />
      </Box>
    </Box>
  );
};

export default BoardTrashBin;
