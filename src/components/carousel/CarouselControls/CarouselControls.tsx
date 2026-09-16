import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@/components/ui/IconButton';

interface CarouselControlsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  autoPlay?: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

export function CarouselControls({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  autoPlay = false,
  isPaused = false,
  onPause,
  onResume,
}: CarouselControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between">
      <IconButton
        className="pointer-events-auto bg-overlay text-text shadow-[var(--shadow-card)] backdrop-blur"
        disabled={!canGoPrevious}
        label="Slide anterior"
        onClick={onPrevious}
        variant="default"
      >
        <ChevronLeftIcon aria-hidden="true" fontSize="inherit" />
      </IconButton>

      <div className="flex items-center gap-2">
        {autoPlay ? (
          <IconButton
            className="pointer-events-auto hidden bg-overlay text-text shadow-[var(--shadow-card)] backdrop-blur sm:inline-flex"
            label={isPaused ? 'Retomar carrossel' : 'Pausar carrossel'}
            onClick={isPaused ? onResume : onPause}
            variant="default"
          >
            {isPaused ? (
              <PlayArrowIcon aria-hidden="true" fontSize="inherit" />
            ) : (
              <PauseIcon aria-hidden="true" fontSize="inherit" />
            )}
          </IconButton>
        ) : null}
        <IconButton
          className="pointer-events-auto bg-overlay text-text shadow-[var(--shadow-card)] backdrop-blur"
          disabled={!canGoNext}
          label="Próximo slide"
          onClick={onNext}
          variant="default"
        >
          <ChevronRightIcon aria-hidden="true" fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
}
