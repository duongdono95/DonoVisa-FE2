import { Box, IconButton, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { randomId, useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { ColumnInterface, ColumnSchema, GUEST_ID } from '../../../types/GeneralTypes';
import { useBoardsStore } from '../../../stores/BoardsStore';
import { boardFunctions } from '../../../hooks/boardFunctions';
import { toast } from 'react-toastify';

interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewColumnForm = ({ isExpanded, setIsExpanded }: Props) => {
  const textFieldRef = useRef<HTMLDivElement>(null);
  const [board] = useBoardsStore((state) => [state.board]);
  const createColumn = boardFunctions.createColumn();
  const [form, setForm] = useState<ColumnInterface>({
    id: randomId(),
    ownerId: GUEST_ID,
    boardId: board?.id ?? '',
    title: 'Column Title ...',
    createdAt: '',
    updatedAt: null,
    _destroy: false,
    cards: [],
    cardOrderIds: [],
  });
  const handleCreateNewColumn = async () => {
    const validatedForm = ColumnSchema.safeParse(form);
    if (!validatedForm.success) return toast.error(validatedForm.error.errors[0].message);
    createColumn(validatedForm.data);
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
