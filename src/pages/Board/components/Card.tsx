import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useDnD } from '../DnD/DnDContext';
import TextFieldComponent from '../../../components/TextFieldComponent';
import MarkdownCard from './MarkdownCard';
import { CardInterface, MarkdownInterface } from '../../../types/GeneralTypes';
import { boardFunctions } from '../../../hooks/boardFunctions';
import { Edit } from 'lucide-react';
import { useMarkdownStore } from '../../../stores/MarkdownStore';
interface CardProps {
  card: CardInterface;
  dragOverlay?: boolean;
}
const Card = ({ dragOverlay, card }: CardProps) => {
  const theme = useTheme();
  const [markdownList] = useMarkdownStore((state) => [state.markdownList]);
  const { activeItem, isDraggingToTrash, openCardDialog, setOpenCardDialog } = useDnD();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
    data: card as CardInterface,
  });
  const dndKitCardStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };
  const editCard = boardFunctions.EditCard();
  const handleSubmit = (data: CardInterface) => {
    editCard(data);
  };

  const [cardMarkdown, setCardMarkdown] = useState<MarkdownInterface>();
  useEffect(() => {
    if (markdownList.length > 0) {
      const md = markdownList.find((markdown) => markdown.cardId === card.id);
      if (md) setCardMarkdown(md);
    }
  }, [markdownList]);
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
      ref={activeItem && 'cards' in activeItem ? undefined : setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(openCardDialog ? undefined : listeners)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <TextFieldComponent data={card} handleSubmit={handleSubmit} />
        <Edit
          onClick={(e) => {
            e.stopPropagation();
            setOpenCardDialog(true);
          }}
        />
      </Box>
      <MarkdownCard
        card={card}
        cardMarkdown={cardMarkdown}
        handleSubmit={handleSubmit}
        openCardDialog={openCardDialog}
        setOpenCardDialog={setOpenCardDialog}
      />
    </Box>
  );
};

export default Card;
