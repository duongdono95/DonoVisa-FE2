import { Box, IconButton, TextField, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { useDnD } from '../DnD/DnDContext';
import { useAppStore } from '../../../stores/AppStore';
import { ColumnInterface } from '../../../types/GeneralTypes';
import { API_createNewCard } from '../../../hooks/fetchingFunctions';
import { useBoardContext } from '../BoardContext';

interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  column: ColumnInterface;
}
const NewCardForm = ({ isExpanded, setIsExpanded, column }: Props) => {
  const theme = useTheme();
  const textFieldRef = useRef<HTMLDivElement>(null);
  const { form, setForm, createCard } = API_createNewCard({ column, setIsExpanded });
  const handlecreateNewColumn = async () => {
    createCard.mutate();
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
