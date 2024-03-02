import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';
import { TRASH_ID } from '../DnD/DroppableContainer';
import { useDnD } from '../DnD/DnDContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CardInterface, ColumnInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { API_deleteCard, API_deleteColumn } from '../../../hooks/API_functions';
import { useAppStore } from '../../../stores/AppStore';
import { toast } from 'react-toastify';

const BoardTrashBin = () => {
  const { attributes, listeners, setNodeRef, isOver } = useSortable({
    id: TRASH_ID,
  });
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { requestDeletingItem } = useDnD();
  const [user] = useAppStore((state) => [state.user]);
  const deleteCardMutation = useMutation({
    mutationFn: (item: CardInterface) => API_deleteCard(item.id),
    onSuccess: (result) => {
      if (result.code === 200) queryClient.invalidateQueries({ queryKey: ['board'] });
    },
    onError: (err) => {
      console.log(err);
      toast.error('Delete card Failed');
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
  const deleteColumnMutation = useMutation({
    mutationFn: (item: ColumnInterface) => API_deleteColumn(item.id),
    onSuccess: (result) => {
      if (result.code === 200) queryClient.invalidateQueries({ queryKey: ['board'] });
    },
    onError: (err) => {
      console.log(err);
      toast.error('Delete card Failed');
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
  useEffect(() => {
    if (requestDeletingItem && user.firstName !== GUEST_ID) {
      if ('columnId' in requestDeletingItem) deleteCardMutation.mutate(requestDeletingItem as CardInterface);
      if ('cards' in requestDeletingItem) deleteColumnMutation.mutate(requestDeletingItem as ColumnInterface);
    }
  }, [requestDeletingItem]);
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
