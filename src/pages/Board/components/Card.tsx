import { Box, useTheme } from '@mui/material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useDnD } from '../DnD/DnDContext';
import TextFieldComponent from '../../../components/TextFieldComponent';
import { CardInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_editCard } from '../../../hooks/API_functions';
import { toast } from 'react-toastify';
import { useAppStore } from '../../../stores/AppStore';
import { useBoardsStore } from '../../../stores/BoardsStore';
import { useMarkdownStore } from '../../../stores/MarkdownStore';
interface CardProps {
  card: CardInterface;
  dragOverlay?: boolean;
}
const Card = ({ dragOverlay, card }: CardProps) => {
  const theme = useTheme();
  const [setActiveCard] = useMarkdownStore((state) => [state.setActiveCard]);
  const { activeItem, isDraggingToTrash } = useDnD();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
    data: card as CardInterface,
  });
  const dndKitCardStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };
  const queryClient = useQueryClient();
  const [user] = useAppStore((state) => [state.user]);
  const [editCard] = useBoardsStore((state) => [state.editCard]);

  const updateCardMutation = useMutation({
    mutationFn: (card: CardInterface) => API_editCard(card),
    onSuccess: (result) => {
      console.log(result);
      if (result.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['board'] });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error updating card');
    },
  });
  const handleSubmit = (data: CardInterface) => {
    if (user.firstName === GUEST_ID && data) editCard(data);
    if (user.firstName !== GUEST_ID && data) updateCardMutation.mutate(data);
  };

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
      {...listeners}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <TextFieldComponent data={card} handleResult={handleSubmit} />
        <Edit
          onClick={(e) => {
            e.stopPropagation();
            setActiveCard(card);
          }}
        />
      </Box>
    </Box>
  );
};

export default Card;
