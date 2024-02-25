/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject, useEffect, useState } from 'react';
import { BoardInterface } from '../types/GeneralTypes';
import { v4 as uuid } from 'uuid';
import { Box } from '@mui/material';
import { Crown } from 'lucide-react';
export const useDivSizeThroughRef = (ref: React.RefObject<HTMLDivElement>, type: 'height' | 'width') => {
  const [returnedValue, setReturnedValue] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        type === 'height' && setReturnedValue(ref.current.clientHeight);
        type === 'width' && setReturnedValue(ref.current.clientWidth);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [ref, type]);
  return returnedValue;
};

export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export const sortingBoard = (boardData: BoardInterface) => {
  boardData.columns.sort((a: any, b: any) => {
    return boardData.columnOrderIds.indexOf(a._id.toString()) - boardData.columnOrderIds.indexOf(b._id.toString());
  });
  boardData.columns.forEach((column: any) => {
    if (column.cards && column.cardOrderIds) {
      column.cards.sort((a: any, b: any) => {
        return column.cardOrderIds.indexOf(a._id.toString()) - column.cardOrderIds.indexOf(b._id.toString());
      });
    }
  });
  return boardData;
};

export const randomId = () => {
  return uuid();
};

export const slugify = (val: any) => {
  if (!val) return '';
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};

export const CrownBadge = () => (
  <Box
    sx={{
      width: 20,
      height: 20,
      bgcolor: 'var(--warning)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Crown size={14} color="white" />
  </Box>
);
