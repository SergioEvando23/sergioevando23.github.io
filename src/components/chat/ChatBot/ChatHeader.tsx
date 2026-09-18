import CloseIcon from '@mui/icons-material/Close';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { IconButton } from '@/components/ui/IconButton';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  closeLabel: string;
  onClose: () => void;
}

export function ChatHeader({ title, subtitle, closeLabel, onClose }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
        <SmartToyOutlinedIcon aria-hidden="true" fontSize="small" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-black text-text">{title}</h2>
        <p className="truncate text-sm text-text-muted">{subtitle}</p>
      </div>
      <IconButton label={closeLabel} onClick={onClose} size="small" variant="ghost">
        <CloseIcon aria-hidden="true" fontSize="inherit" />
      </IconButton>
    </header>
  );
}
