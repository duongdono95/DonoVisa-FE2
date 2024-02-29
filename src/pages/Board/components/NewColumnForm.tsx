import { Box, IconButton, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { randomId, useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { ColumnInterface, ColumnSchema, GUEST_ID } from '../../../types/GeneralTypes';
import { useBoardsStore } from '../../../stores/BoardsStore';
import { toast } from 'react-toastify';
import { useAppStore } from '../../../stores/AppStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_createColumn } from '../../../hooks/API_functions';

interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewColumnForm = ({ isExpanded, setIsExpanded }: Props) => {
  const textFieldRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [user] = useAppStore((state) => [state.user]);
  const [board, addColumn] = useBoardsStore((state) => [state.board, state.addColumn]);
  const [form, setForm] = useState<ColumnInterface>({
    id: randomId(),
    ownerId: user.id,
    boardId: board?.id ?? '',
    title: 'Column Title ...',
    createdAt: '',
    updatedAt: null,
    _destroy: false,
    cards: [],
    cardOrderIds: [],
  });

  const createColMutation = useMutation({
    mutationFn: (col: ColumnInterface) => API_createColumn(col),
    onSuccess: (result) => {
      if (result.code === 200) {
        addColumn(result.data);
        queryClient.invalidateQueries({ queryKey: ['board'] });
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Creating New Column Failed');
    },
  });
  const handleCreateNewColumn = async () => {
    const validatedForm = ColumnSchema.safeParse(form);
    if (!validatedForm.success) return toast.error(validatedForm.error.errors[0].message);
    if (user.firstName === GUEST_ID) addColumn(validatedForm.data);
    if (user.firstName !== GUEST_ID && user._id) createColMutation.mutate(validatedForm.data);
    setIsExpanded(false);
  };
  useOutsideClick(textFieldRef, () => {
    if (isExpanded) setIsExpanded(false);
  });

  return (
    <Box ref={textFieldRef} sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px' }}>
      <TextField
        label="Column Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        fullWidth
        InputProps={{
          disableUnderline: true,
        }}
        variant={'filled'}
        inputProps={{ style: { fontSize: '14px', fontWeight: 600 } }}
        autoFocus
        onFocus={(e) => e.target.select()}
        sx={{ borderRadius: '10px !important', overflow: 'hidden' }}
        onKeyDown={(e) => {
          e.key === 'Enter' && handleCreateNewColumn();
          e.key === 'Escape' && setIsExpanded(false);
        }}
      />
      <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={() => handleCreateNewColumn()}>
          <Send style={{ paddingTop: '5px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NewColumnForm;
