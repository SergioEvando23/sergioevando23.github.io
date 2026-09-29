import { useLanguage } from '@/components/language';

export function Logo() {
  const { translations } = useLanguage();

  return (
    <span className="text-xl font-black tracking-normal text-text">
      {translations.brand.initials}
      <span className="text-primary">.</span>
    </span>
  );
}
