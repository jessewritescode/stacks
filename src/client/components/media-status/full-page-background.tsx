import React from 'react';
import { Box } from '@chakra-ui/react';

interface IFullPageBackgroundProps {
  src: string;
  alt?: string;
}

const FullPageBackground: React.FC<IFullPageBackgroundProps> = ({ src, alt }) => {
  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      width='100vw'
      height='100vh'
      backgroundImage={`url(${src})`}
      backgroundPosition='center'
      backgroundRepeat='no-repeat'
      backgroundSize='cover'
      filter='blur(8px)'
      transform='scale(1.1)'
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bg: 'black',
        opacity: 0.6,
      }}
      aria-label={alt}
      zIndex={-1}
    />
  );
};

export default FullPageBackground;
