import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

type HeroVideoPanelProps = {
  src?: string;
  posterSrc?: string;
  posterAlt?: string;
};

const defaultVideoSrc = '/hero/assessment-loop.mp4';

function VideoFallback({ posterAlt, posterSrc }: Required<Pick<HeroVideoPanelProps, 'posterAlt'>> & {
  posterSrc?: string;
}) {
  if (posterSrc) {
    return (
      <Box
        component="img"
        src={posterSrc}
        alt={posterAlt}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        p: { xs: 3, md: 4 },
        backgroundImage:
          'radial-gradient(circle at 30% 25%, rgba(17, 17, 17, 0.08), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(247, 243, 237, 0.94) 100%)'
      }}
    >
      <Typography variant="overline" color="text.secondary">
        Product preview
      </Typography>
      <Typography variant="h5" sx={{ maxWidth: 260 }}>
        A quiet preview panel for the assessment experience.
      </Typography>
    </Box>
  );
}

export default function HeroVideoPanel({
  src = defaultVideoSrc,
  posterSrc,
  posterAlt = 'Preview of the assessment experience'
}: HeroVideoPanelProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    noSsr: true
  });
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [src, posterSrc]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-end' }
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 420, md: 560 },
          aspectRatio: '1 / 1',
          borderRadius: { xs: 4, md: 6 },
          overflow: 'hidden',
          bgcolor: 'rgba(17, 17, 17, 0.03)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {prefersReducedMotion || videoFailed ? (
          <VideoFallback posterAlt={posterAlt} posterSrc={posterSrc} />
        ) : (
          <Box
            component="video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setVideoFailed(true)}
            poster={posterSrc}
            sx={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: 'rgba(17, 17, 17, 0.03)'
            }}
          >
            <source src={src} type="video/mp4" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
