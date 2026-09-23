import { useLanguage } from '@/components/language';

export function Logo() {
  const { textos } = useLanguage();

  return (
    <span className="text-xl font-black tracking-normal text-text">
      {textos.brand.initials}
      <span className="text-primary">.</span>
    </span>
  );
}
