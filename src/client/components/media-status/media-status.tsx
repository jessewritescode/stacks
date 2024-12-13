import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { Text, Flex, Image, Box } from '@chakra-ui/react';
import {
  fetchMediaStatus,
  selectMediaStatus,
  selectCurrentTrack,
  selectMediaStatusError,
} from '@features/media-status-slice';
import FullPageBackground from './full-page-background';

const MediaStatus = () => {
  const dispatch: AppDispatch = useDispatch();

  const status = useSelector(selectMediaStatus);
  const track = useSelector(selectCurrentTrack);
  const error = useSelector(selectMediaStatusError);

  useEffect(() => {
    // Function to poll the media status
    const pollMediaStatus = () => {
      dispatch(fetchMediaStatus());
    };

    // Poll every 1000ms
    const intervalId = setInterval(pollMediaStatus, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (error) return <p>Error: {error} </p>;
  if (!track) return <p>No media is currently playing.</p>;

  return (
    <>
      <FullPageBackground src={track.albumArtURL || ''} alt='' />
      <Flex gap='4' p='4' flexDir='column' alignItems='center' justifyContent='center' height='100vh'>
        {track.albumArtURL && (
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
              src={track.albumArtURL}
              alt={track.album}
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
};

export default MediaStatus;
