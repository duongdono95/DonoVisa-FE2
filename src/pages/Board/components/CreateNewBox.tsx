import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NewColumnForm from './NewColumnForm';
import { CREATE_NEW_ID } from '../DnD/DroppableContainer';

export default function CreateNewBox() {
  const theme = useTheme();
  const { attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id: CREATE_NEW_ID,
  });
  const dndKitColumnStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'pointer',
    opacity: isDragging ? 0.5 : undefined,
    width: '300px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    overFlow: 'hidden',
  };
  const isDraggedOverCreatNew = over && over.id === CREATE_NEW_ID;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={dndKitColumnStyles}
      sx={{
        overflow: 'hidden',
        transition: 'height 0.3s ease-in-out',
        border: '2px dashed var(--primary05)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        bgcolor: isDraggedOverCreatNew ? 'var(--primary)' : undefined,
        boxShadow: isDraggedOverCreatNew
          ? theme.palette.mode === 'dark'
            ? '0px 0px 15px var(--white05)'
            : '0px 0px 15px var(--black02)'
          : undefined,
        '&:hover': {
          bgcolor: isExpanded ? undefined : 'var(--primary01)',
        },
      }}
      className="create-new"
      onClick={() => {
        setIsExpanded(true);
      }}
    >
      <p className="noselect" style={{ lineHeight: '50px' }}>
        Create New Column
      </p>
      {isExpanded && <NewColumnForm isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
    </Box>
  );
}
