import { Box, Dialog, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMarkdownStore } from '../../../stores/MarkdownStore';
import { useBoardsStore } from '../../../stores/BoardsStore';
import Markdown from '../../../components/Markdown';
import { CardInterface, GUEST_ID, MarkdownInterface } from '../../../types/GeneralTypes';
import { emptyMarkdown } from '../../../utils/constants';
import { randomId } from '../../../hooks/GeneralHooks';
import { toast } from 'react-toastify';
import { useAppStore } from '../../../stores/AppStore';
import { useMutation } from '@tanstack/react-query';
import { API_createMarkdown } from '../../../hooks/API_functions';

const MarkdownCard = () => {
  const [activeCard, setActiveCard, markdownList, addToMarkdownList] = useMarkdownStore((state) => [
    state.activeCard,
    state.setActiveCard,
    state.markdownList,
    state.addToMarkdownList,
  ]);
  const [user] = useAppStore((state) => [state.user]);
  const [editCard] = useBoardsStore((state) => [state.editCard]);
  const [localMarkdown, setLocalMarkdown] = useState<MarkdownInterface | null>(null);
  const [localCardTitle, setLocalCardTitle] = useState<{ readonly: boolean; title: string }>({ readonly: true, title: '' });
  const editCardMutation = useMutation({
    mutationFn: (markdown: MarkdownInterface) => API_createMarkdown(markdown),
    onSuccess: (result) => {
      console.log(result);
    },
    onError: (err) => {
      console.log(err);
      toast.error('Error creating markdown');
    },
  });
  const handleClose = () => {
    // if the markdown content is added, -> update card, update markdownList
    if (localMarkdown && localMarkdown.content.length > 0 && activeCard) {
      const updatedCard = { ...activeCard, title: localCardTitle.title, markdown: localMarkdown.id };
      if (user.firstName !== GUEST_ID) {
        editCardMutation.mutate(localMarkdown);
      } else {
        editCard(updatedCard);
        addToMarkdownList(localMarkdown);
      }
    }

    setActiveCard(null);
  };
  useEffect(() => {
    if (activeCard) {
      setLocalCardTitle((prev) => ({ ...prev, title: activeCard.title }));
      if (activeCard.markdown) {
        const markdown = markdownList.find((md) => md.id === activeCard.markdown);
        if (markdown) setLocalMarkdown(markdown);
        if (!markdown)
          setLocalMarkdown({ ...emptyMarkdown, userId: user.id, id: randomId(), cardId: activeCard.id, createdAt: new Date().toString() });
      }
      if (!activeCard.markdown) {
        setLocalMarkdown({ ...emptyMarkdown, userId: user.id, id: randomId(), cardId: activeCard.id, createdAt: new Date().toString() });
      }
    }
  }, [activeCard]);
  return (
    localMarkdown && (
      <Dialog sx={{ zIndex: 1 }} open={activeCard ? true : false} onClose={handleClose}>
        <TextField
          value={localCardTitle.title}
          onChange={(e) => setLocalCardTitle((prev) => ({ ...prev, title: e.target.value }))}
          InputProps={{ readOnly: localCardTitle.readonly, disableUnderline: localCardTitle.readonly }}
          onBlur={() => setLocalCardTitle((prev) => ({ ...prev, readonly: true }))}
          onClick={() => setLocalCardTitle((prev) => ({ ...prev, readonly: false }))}
          variant={'standard'}
          inputProps={{
            style: {
              color: 'var(--black07)',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 600,
              padding: '20px 15px 10px 15px',
              backgroundColor: 'var(--primary05)',
            },
          }}
        />
        <Box sx={{ margin: '10px 15px' }}>
          <Markdown markdown={localMarkdown} setMarkdown={setLocalMarkdown} />
        </Box>
      </Dialog>
    )
  );
};

export default MarkdownCard;
