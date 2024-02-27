import { Box, IconButton, TextField, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { randomId, useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { CardInterface, ColumnInterface, GUEST_ID } from '../../../types/GeneralTypes';
import { boardFunctions } from '../../../hooks/boardFunctions';
interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  column: ColumnInterface;
}
const NewCardForm = ({ isExpanded, setIsExpanded, column }: Props) => {
  const theme = useTheme();
  const textFieldRef = useRef<HTMLDivElement>(null);
  const createCard = boardFunctions.createCard();
  const [form, setForm] = useState<CardInterface>({
    id: randomId(),
    ownerId: GUEST_ID,
    columnId: column.id,
    title: 'Card Title ...',
    _destroy: false,
    createdAt: new Date().toString(),
    updatedAt: null,
  });
  const handlecreateNewColumn = async () => {
    createCard(form);
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
          e.key === 'Enter' && handlecreateNewColumn();
          e.key === 'Escape' && setIsExpanded(false);
        }}
      />
      <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={() => handlecreateNewColumn()}>
          <Send style={{ paddingTop: '5px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NewCardForm;
