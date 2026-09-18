import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { Button } from '@/components/ui/Button';

const suggestionKeys = [
  'react',
  'projects',
  'mobile',
  'architecture',
  'tests',
  'stack',
  'experience',
] as const;

type SuggestionKey = (typeof suggestionKeys)[number];

interface ChatSuggestionsProps {
  labels: readonly string[];
  questions: { readonly [K in SuggestionKey]: string };
  ariaLabel: string;
  disabled: boolean;
  onSelect: (question: string) => void;
}

export function ChatSuggestions({
  labels,
  questions,
  ariaLabel,
  disabled,
  onSelect,
}: ChatSuggestionsProps) {
  return (
    <div aria-label={ariaLabel} className="border-t border-border px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {suggestionKeys.map((key, index) => (
          <Button
            className="min-h-9 px-3 text-xs"
            disabled={disabled}
            key={key}
            leftIcon={<AutoAwesomeOutlinedIcon aria-hidden="true" fontSize="small" />}
            onClick={() => onSelect(questions[key])}
            size="small"
            variant="secondary"
          >
            {labels[index]}
          </Button>
        ))}
      </div>
    </div>
  );
}
