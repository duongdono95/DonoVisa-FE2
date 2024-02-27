import React, { useEffect, useState } from 'react';
import { Box, Dialog } from '@mui/material';
import Markdown from '../../../components/Markdown';
import TextFieldComponent from '../../../components/TextFieldComponent';
import { CardInterface, MarkdownInterface } from '../../../types/GeneralTypes';
import { useMarkdownStore } from '../../../stores/MarkdownStore';
import { emptyMarkdown } from '../../../utils/constants';

interface Props {
  card: CardInterface;
  cardMarkdown: MarkdownInterface | undefined;
  handleSubmit: (data: CardInterface) => void;
  openCardDialog: boolean;
  setOpenCardDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarkdownCard = ({ card, cardMarkdown, handleSubmit, openCardDialog, setOpenCardDialog }: Props) => {
  const defaultMarkdown: MarkdownInterface = { ...emptyMarkdown, cardId: card.id };
  const [addToMarkdownList, editFromMarkdownList] = useMarkdownStore((state) => [state.addToMarkdownList, state.editFromMarkdownList]);
  const [markdown, setMarkdown] = useState<MarkdownInterface>(cardMarkdown ?? defaultMarkdown);
  const handleOnClose = () => {
    if (markdown.content.length > 0) {
      if (!cardMarkdown) addToMarkdownList(markdown);
      if (cardMarkdown) editFromMarkdownList(markdown);
    }
    setOpenCardDialog(false);
  };
  return (
    <Dialog sx={{ zIndex: 1 }} open={openCardDialog} onClose={() => handleOnClose()}>
      <Box sx={{ padding: '10px 10px 0 20px', bgcolor: 'var(--black01)' }}>
        <TextFieldComponent data={card} handleSubmit={handleSubmit} fontSize={24} />
      </Box>
      <Box sx={{ minWidth: '400px', maxWidth: '100vw', width: '100%', borderRadius: '5px', overflow: 'hidden', height: '50vh', padding: '10px' }}>
        <Markdown markdown={markdown} setMarkdown={setMarkdown} />
      </Box>
    </Dialog>
  );
};

export default MarkdownCard;
