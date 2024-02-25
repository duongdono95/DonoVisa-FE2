import React, { useState } from 'react';
import { Box, Dialog } from '@mui/material';
import Markdown from '../../../components/Markdown';
import TextFieldComponent from '../../../components/TextFieldComponent';
import { useDnD } from '../DnD/DnDContext';
import { CardInterface } from '../../../types/GeneralTypes';

interface Props {
  card: CardInterface;
  handleSubmit: (data: CardInterface) => void;
}

const MarkdownCard = ({ card, handleSubmit }: Props) => {
  const [markdown, setMarkdown] = useState('');
  const { openCardDialog, setOpenCardDialog } = useDnD();
  return (
    <Dialog sx={{ zIndex: 1 }} open={openCardDialog} onClose={() => setOpenCardDialog(false)}>
      <Box sx={{ padding: '10px 10px 0 20px', bgcolor: 'var(--black01)' }}>
        <TextFieldComponent data={card} handleSubmit={handleSubmit} fontSize={24} />
      </Box>
      <Box sx={{ minWidth: '400px', maxWidth: '100vw', width: '100%', borderRadius: '5px', overflow: 'hidden', height: '50vh', padding: '10px' }}>
        <Markdown handleMarkdown={setMarkdown} />
      </Box>
    </Dialog>
  );
};

export default MarkdownCard;
