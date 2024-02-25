import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useDnD } from '../DnD/DnDContext';
import TextFieldComponent from '../../../components/TextFieldComponent';
import MarkdownCard from './MarkdownCard';
import { CardInterface } from '../../../types/GeneralTypes';
interface CardProps {
  card: CardInterface;
  dragOverlay?: boolean;
}
const Card = ({ dragOverlay, card }: CardProps) => {
  const theme = useTheme();
  const { isSortingColumn, isDraggingToTrash, openCardDialog, setOpenCardDialog } = useDnD();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
    data: card as CardInterface,
  });
  const dndKitCardStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };
  const handleSubmit = (data: CardInterface) => {};

  return (
    <Box
      className={`${dragOverlay ? (theme.palette.mode === 'dark' ? 'card card-dragging-effect-light' : 'card card-dragging-effect-dark') : 'card'}`}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'var(--primary-dark)' : 'white',
        bgcolor: dragOverlay ? (theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)') : undefined,
        backdropFilter: 'blur(10px)',
        borderRadius: '5px',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: `0px 0px 10px ${theme.palette.mode === 'dark' ? 'var(--white02)' : 'var(--black02)'}`,
        },
        boxShadow:
          isDraggingToTrash && dragOverlay
            ? '2px 2px 20px rgba(255, 0, 0, 0.5)'
            : dragOverlay
            ? `5px 5px 10px ${theme.palette.mode === 'dark' ? 'var(--white02)' : 'var(--black01)'}`
            : undefined,
        transform: isDraggingToTrash && dragOverlay ? 'scale(0.5)' : undefined,
      }}
      ref={isSortingColumn ? undefined : setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(openCardDialog ? undefined : listeners)}
    >
      <Box sx={{ padding: '10px' }} onClick={() => setOpenCardDialog(true)}>
        <TextFieldComponent data={card} handleSubmit={handleSubmit} />
        {/* {card.coverImgUrl && (
          <Box
            sx={{
              backgroundImage: `url(${card.coverImgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '120px',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          ></Box>
        )} */}
      </Box>
      <MarkdownCard card={card} handleSubmit={handleSubmit} />
    </Box>
  );
};

export default Card;
