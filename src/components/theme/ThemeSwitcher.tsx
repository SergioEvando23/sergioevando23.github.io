'use client';

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language';
import { IconButton } from '@/components/ui/IconButton';
import { THEME_STORAGE_KEY } from '@/config/theme';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/cn';

const themes = [
  {
    value: 'light',
    labelKey: 'light',
    icon: LightModeOutlinedIcon,
  },
  {
    value: 'dark',
    labelKey: 'dark',
    icon: DarkModeOutlinedIcon,
  },
  {
    value: 'system',
    labelKey: 'system',
    icon: SettingsBrightnessOutlinedIcon,
  },
] as const;

export function ThemeSwitcher() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const { textos } = useLanguage();
  const selectedTheme = mounted ? (theme ?? 'system') : 'system';

  const applyTheme = (value: (typeof themes)[number]['value']) => {
    setTheme(value);
    localStorage.setItem(THEME_STORAGE_KEY, value);

    const shouldUseDark =
      value === 'dark' ||
      (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', shouldUseDark);
    document.documentElement.classList.toggle('light', !shouldUseDark);
  };

  return (
    <div
      aria-label={textos.theme.label}
      className="inline-flex rounded-[var(--radius-full)] border border-border bg-overlay p-1 shadow-[var(--shadow-card)] backdrop-blur"
      role="radiogroup"
    >
      {themes.map((item) => {
        const Icon = item.icon;
        const selected = selectedTheme === item.value;

        return (
          <IconButton
            aria-checked={selected}
            className={cn(
              'h-10 min-h-10 w-10 min-w-10 border-0 bg-transparent text-text-muted',
              selected &&
                'bg-primary text-primary-foreground shadow-[var(--shadow-glow)]',
            )}
            key={item.value}
            label={textos.theme.optionLabel(textos.theme[item.labelKey])}
            onClick={() => applyTheme(item.value)}
            role="radio"
            size="small"
            variant="ghost"
          >
            <Icon aria-hidden="true" fontSize="inherit" />
          </IconButton>
        );
      })}
    </div>
  );
}
