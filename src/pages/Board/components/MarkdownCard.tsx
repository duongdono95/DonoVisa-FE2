import { Box, Button, Dialog, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMarkdownStore } from '../../../stores/MarkdownStore';
import { useBoardsStore } from '../../../stores/BoardsStore';
import Markdown from '../../../components/Markdown';
import { GUEST_ID, MarkdownInterface } from '../../../types/GeneralTypes';

import { toast } from 'react-toastify';
import { useAppStore } from '../../../stores/AppStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_createMarkdown } from '../../../hooks/API_functions';
import { emptyMarkdown } from '../../../utils/constants';
import { randomId } from '../../../hooks/GeneralHooks';

const MarkdownCard = () => {
  const [activeCard, setActiveCard, markdownList, addToMarkdownList, localStorage] = useMarkdownStore((state) => [
    state.activeCard,
    state.setActiveCard,
    state.markdownList,
    state.addToMarkdownList,
    state.localStorage,
  ]);
  const [board] = useBoardsStore((state) => [state.board]);
  const [user] = useAppStore((state) => [state.user]);
  const [editCard] = useBoardsStore((state) => [state.editCard]);
  const [localMarkdown, setLocalMarkdown] = useState<MarkdownInterface>(emptyMarkdown);
  const [clonedMarkdown, setClonedMarkdown] = useState<MarkdownInterface | null>(null);
  const [localCardTitle, setLocalCardTitle] = useState<{ readonly: boolean; title: string }>({ readonly: true, title: '' });
  const queryClient = useQueryClient();
  const createMDMutation = useMutation({
    mutationFn: (markdown: MarkdownInterface) => API_createMarkdown(markdown),
    onSuccess: (result) => {
      if (result.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['board'] });
        activeCard && editCard({ ...activeCard, markdown: result.data.id });
        addToMarkdownList(result.data);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error('Error creating markdown');
    },
  });
  console.log(board);
  const handleClose = () => {
    // if the markdown content is added, -> update card, update markdownList
    if (localMarkdown && localMarkdown.content.length > 0 && activeCard) {
      const updatedCard = { ...activeCard, title: localCardTitle.title, markdown: localMarkdown.id };
      if (localMarkdown.content !== clonedMarkdown?.content) {
        if (user.firstName !== GUEST_ID) {
          createMDMutation.mutate(localMarkdown);
        } else {
          editCard(updatedCard);
          addToMarkdownList(localMarkdown);
        }
      }
    }
    if (activeCard && localCardTitle.title !== activeCard.title) {
      editCard({ ...activeCard, title: localCardTitle.title });
    }
    setActiveCard(null);
  };
  useEffect(() => {
    setClonedMarkdown(null);
    if (activeCard) {
      setLocalCardTitle((prev) => ({ ...prev, title: activeCard.title }));
      if (activeCard.markdown) {
        const markdown = markdownList.find((md) => md.id === activeCard.markdown);
        if (!markdown) {
          toast.error('Sorry, we lost the data of your card, please try again.');
          setLocalMarkdown({
            id: randomId(),
            userId: user.id,
            cardId: activeCard.id,
            content: '',
            createdAt: new Date().toString(),
            updatedAt: null,
            _destroy: false,
          });
        }
        if (markdown) {
          setLocalMarkdown(markdown);
          setClonedMarkdown(markdown);
        }
      }
      if (!activeCard.markdown) {
        setLocalMarkdown({
          id: randomId(),
          userId: user.id,
          cardId: activeCard.id,
          content: '',
          createdAt: new Date().toString(),
          updatedAt: null,
          _destroy: false,
        });
      }
    }
  }, [activeCard]);
  return (
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
        {activeCard && localMarkdown && <Markdown localMarkdown={localMarkdown} setLocalMarkdown={setLocalMarkdown} />}
      </Box>
    </Dialog>
  );
};

export default MarkdownCard;
