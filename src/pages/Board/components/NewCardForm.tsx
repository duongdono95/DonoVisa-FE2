import { Box, IconButton, TextField, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { randomId, useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { CardInterface, CardSchema, ColumnInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { useAppStore } from '../../../stores/AppStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_createCard } from '../../../hooks/API_functions';
import { toast } from 'react-toastify';
import { useBoardsStore } from '../../../stores/BoardsStore';
interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  column: ColumnInterface;
}
const NewCardForm = ({ isExpanded, setIsExpanded, column }: Props) => {
  const theme = useTheme();
  const textFieldRef = useRef<HTMLDivElement>(null);
  const [user] = useAppStore((state) => [state.user]);
  const [addCard, board] = useBoardsStore((state) => [state.addCard, state.board]);
  const [form, setForm] = useState<CardInterface>({
    id: '',
    ownerId: user.id,
    columnId: column.id,
    boardId: board?.id ?? '',
    title: 'Card Title ...',
    _destroy: false,
    createdAt: new Date().toString(),
    updatedAt: null,
  });

  const createCardMutation = useMutation({
    mutationFn: (card: CardInterface) => API_createCard(card),
    onSuccess: (result) => {
      if (result.code === 200) {
        addCard(result.data);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error('Creating card failed');
    },
  });
  const handlecreateNewCard = async () => {
    const newId = randomId();
    const validatedForm = CardSchema.safeParse(form);
    if (!validatedForm.success) return toast.error(validatedForm.error.errors[0].message);

    if (user.firstName === GUEST_ID && board && board.id) addCard({ ...validatedForm.data, id: newId, boardId: board.id });
    if (user.firstName !== GUEST_ID && board && board.id) createCardMutation.mutate({ ...validatedForm.data, id: newId, boardId: board.id });

    setIsExpanded(false);
  };

  useOutsideClick(textFieldRef, () => {
    if (isExpanded) setIsExpanded(false);
  });
  return (
    <Box ref={textFieldRef} sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px' }}>
      <TextField
        label="Card Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        fullWidth
        variant={'filled'}
        inputProps={{ style: { fontSize: '14px', fontWeight: 600 } }}
        autoFocus
        onFocus={(e) => e.target.select()}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{ borderRadius: '10px !important', bgcolor: theme.palette.mode === 'dark' ? 'var(--white02)' : 'white', overflow: 'hidden' }}
        onKeyDown={(e) => {
          e.key === 'Enter' && handlecreateNewCard();
          e.key === 'Escape' && setIsExpanded(false);
        }}
      />
      <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={() => handlecreateNewCard()}>
          <Send style={{ paddingTop: '5px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NewCardForm;
