import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { Text, Flex, Image, Box } from '@chakra-ui/react';
import {
  fetchMediaStatus,
  next,
  prev,
  selectMediaStatus,
  selectMediaStatusError,
  selectQueuePosition,
} from '@features/media-status-slice';
import { fetchMediaQueue, selectMediaQueueItems, selectMediaQueue } from '@features/media-queue-slice';
import HorizontalSwipe from '../horizontal-swipe';
import FullPageBackground from './full-page-background';
import { ITrack } from '@shared/track';

const MediaStatus = () => {
  const dispatch: AppDispatch = useDispatch();

  const status = useSelector(selectMediaStatus);
  const queuePosition = useSelector(selectQueuePosition);
  const error = useSelector(selectMediaStatusError);

  const items = useSelector(selectMediaQueueItems);
  const x = useSelector(selectMediaQueue);

  const [currentIndex, setCurrentIndex] = useState(queuePosition - 1 || 0);

  const currentItem = items[currentIndex];
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : undefined;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined;

  const prefetchImage = (url: string) => {
    const img = new window.Image();
    img.src = url;
  };

  const handleChangeCurrent = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && prevItem) {
      setCurrentIndex((idx) => idx - 1);
      dispatch(prev());
    } else if (direction === 'next' && nextItem) {
      dispatch(next());
      setCurrentIndex((idx) => idx + 1);
    }
  };

  useEffect(() => {
    dispatch(fetchMediaStatus());
    const pollMediaStatus = () => {
      dispatch(fetchMediaStatus());
    };

    const intervalId = setInterval(pollMediaStatus, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    console.log('fetching media queue');
    dispatch(fetchMediaQueue());
  }, [currentItem?.uri, queuePosition]);

  useEffect(() => {
    setCurrentIndex(queuePosition || 0);

    const prev = items[queuePosition - 1];
    const next = items[queuePosition + 1];
    prefetchImage(prev?.albumArtURL || '');
    prefetchImage(next?.albumArtURL || '');
  }, [queuePosition]);

  if (error) return <p>Error: {error} </p>;
  if (!currentItem) return <p>No media is currently playing.</p>;

  const renderItem = (currentItem: ITrack) => (
    <>
      <Flex gap='4' p='4' flexDir='column' alignItems='center' justifyContent='center' height='100vh'>
        {currentItem.albumArtURL && (
          <Box
            width='80vw'
            height='80vw'
            maxWidth='80vh'
            maxHeight='80vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
            position='relative'
          >
            <Image
              src={currentItem.albumArtURL}
              alt={currentItem.album}
              objectFit='cover'
              width='100%'
              height='100%'
              borderRadius='2xl'
              boxShadow='2xl'
              zIndex={-1}
              position='absolute'
            />
            <Box
              height='100%'
              width='100%'
              borderRadius='2xl'
              boxShadow='inset 0 0 1px 1px rgba(255, 255, 255, 0.2)'
              position='absolute'
            />
          </Box>
        )}
      </Flex>
    </>
  );

  if (!currentItem) return null;

  return (
    <>
      <FullPageBackground src={currentItem.albumArtURL || ''} alt='' />
      <HorizontalSwipe
        currentItem={currentItem}
        prevItem={prevItem}
        nextItem={nextItem}
        onChangeCurrent={handleChangeCurrent}
        renderItem={renderItem}
        getItemKey={(item) => item.id}
      />
    </>
  );
};

export default MediaStatus;
