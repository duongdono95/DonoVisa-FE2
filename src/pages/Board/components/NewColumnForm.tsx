import { Box, IconButton, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useOutsideClick } from '../../../hooks/GeneralHooks';
import { Send } from 'lucide-react';
import { useDnD } from '../DnD/DnDContext';
import { API_createColumn } from '../../../hooks/fetchingFunctions';
import { useBoardContext } from '../BoardContext';
interface Props {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewColumnForm = ({ isExpanded, setIsExpanded }: Props) => {
  const textFieldRef = useRef<HTMLDivElement>(null);
  const { form, setForm, createColumn } = API_createColumn({ setIsExpanded });
  const { setBoard } = useBoardContext();
  const handleCreateNewColumn = async () => {
    // createColumn.mutate(form);
    setBoard((prev) => {
      if (!prev) return null;
      const clonedBoard = { ...prev };
      clonedBoard.columns.push(form);
      return clonedBoard;
    });
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
