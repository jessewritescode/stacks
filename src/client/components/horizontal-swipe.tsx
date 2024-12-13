import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

interface IHorizontalSwipeProps<T> {
  currentItem: T;
  prevItem?: T;
  nextItem?: T;
  snapThreshold?: number;
  snapDuration?: number;
  onChangeCurrent: (direction: 'prev' | 'next') => void;
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string | number;
}

const useHorizontalSwipe = (
  hasPrev: boolean,
  hasNext: boolean,
  snapThreshold: number,
  onSnap: (direction: 'prev' | 'next' | 'none') => void,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  const handleStart = useCallback(
    (clientX: number) => {
      if (isSnapping) return;
      setStartX(clientX);
      setIsDragging(true);
    },
    [isSnapping],
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || startX === null) return;
      const deltaX = clientX - startX;
      // If no prev item, limit dragging to the left only
      // If no next item, limit dragging to the right only
      let limitedDeltaX = deltaX;
      if (!hasPrev && deltaX > 0) {
        limitedDeltaX = deltaX * 0.2; // slight resistance if no prev
      }
      if (!hasNext && deltaX < 0) {
        limitedDeltaX = deltaX * 0.2; // slight resistance if no next
      }
      setTranslateX(limitedDeltaX);
    },
    [isDragging, startX, hasPrev, hasNext],
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const direction: 'prev' | 'next' | 'none' =
      translateX > snapThreshold && hasPrev ? 'prev' : translateX < -snapThreshold && hasNext ? 'next' : 'none';

    onSnap(direction);
  }, [isDragging, translateX, snapThreshold, hasPrev, hasNext, onSnap]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX);
    },
    [handleStart],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove],
  );

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX);
    },
    [handleStart],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    },
    [handleMove, isDragging],
  );

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onMouseLeave = useCallback(() => {
    if (isDragging) {
      handleEnd();
    }
  }, [handleEnd, isDragging]);

  return {
    containerRef,
    translateX,
    isSnapping,
    setIsSnapping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };
};
const HorizontalSwipe = <T,>({
  currentItem,
  prevItem,
  nextItem,
  snapThreshold = 100,
  snapDuration = 300,
  onChangeCurrent,
  renderItem,
  getItemKey,
}: IHorizontalSwipeProps<T>) => {
  const hasPrev = !!prevItem;
  const hasNext = !!nextItem;

  const handleSnap = useCallback(
    (direction: 'prev' | 'next' | 'none') => {
      if (direction === 'none') {
        setIsSnapping(true);
        setTranslateX(0);
        setTimeout(() => {
          setIsSnapping(false);
        }, snapDuration);
      } else {
        // animate snapping to full screen width
        setIsSnapping(true);
        setTranslateX(direction === 'prev' ? window.innerWidth : -window.innerWidth);
        setTimeout(() => {
          onChangeCurrent(direction);
          setTranslateX(0);
          setIsSnapping(false);
        }, snapDuration);
      }
    },
    [onChangeCurrent, snapDuration],
  );

  const {
    containerRef,
    translateX,
    setIsSnapping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  } = useHorizontalSwipe(hasPrev, hasNext, snapThreshold, handleSnap);

  const [isSnapping, setIsSnappingState] = useState(false);

  useEffect(() => {
    setIsSnappingState(isSnapping);
  }, [isSnapping]);

  const [translateXState, setTranslateX] = useState(0);
  useEffect(() => {
    setTranslateX(translateX);
  }, [translateX]);

  return (
    <Box
      ref={containerRef}
      pos='relative'
      w='100vw'
      h='100vh'
      overflow='hidden'
      userSelect='none'
      touchAction='pan-y'
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <Box
        w='300vw'
        h='100%'
        display='flex'
        flexDir='row'
        transform={`translateX(calc(-100vw + ${translateXState}px))`}
        transition={isSnapping ? `transform ${snapDuration}ms ease` : undefined}
      >
        <Box w='100vw' key={prevItem ? getItemKey(prevItem) : 'prev-placeholder'} h='100vh'>
          {prevItem && renderItem(prevItem)}
        </Box>
        <Box w='100vw' key={currentItem ? getItemKey(currentItem) : 'curr-placeholder'} h='100vh'>
          {renderItem(currentItem)}
        </Box>
        <Box w='100vw' key={nextItem ? getItemKey(nextItem) : 'next-placeholder'} h='100vh'>
          {nextItem && renderItem(nextItem)}
        </Box>
      </Box>
    </Box>
  );
};

export default HorizontalSwipe;
