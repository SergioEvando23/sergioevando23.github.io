import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@/components/ui/IconButton';

interface MarkdownRendererProps {
  lines: readonly string[];
  copyLabel: string;
}

export function MarkdownRenderer({ lines, copyLabel }: MarkdownRendererProps) {
  const blocks: React.ReactNode[] = [];
  let codeLines: string[] = [];
  let codeBlockIndex = 0;
  let inCodeBlock = false;

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        const code = codeLines.join('\n');
        const blockKey = `code-${codeBlockIndex}`;
        blocks.push(
          <div
            className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-secondary"
            key={blockKey}
          >
            <pre className="max-h-56 overflow-auto p-4 text-xs leading-6 text-text">
              <code>{code}</code>
            </pre>
            <IconButton
              className="absolute right-3 top-3 bg-overlay"
              label={copyLabel}
              onClick={() => void navigator.clipboard?.writeText(code)}
              size="small"
              variant="ghost"
            >
              <ContentCopyIcon aria-hidden="true" fontSize="inherit" />
            </IconButton>
          </div>,
        );
        codeBlockIndex += 1;
        codeLines = [];
        inCodeBlock = false;
        return;
      }

      inCodeBlock = true;
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h2 className="text-3xl font-black text-text" key={index}>
          {line.replace('# ', '')}
        </h2>,
      );
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3 className="pt-4 text-2xl font-black text-text" key={index}>
          {line.replace('## ', '')}
        </h3>,
      );
      return;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h4 className="pt-2 text-lg font-bold text-text" key={index}>
          {line.replace('### ', '')}
        </h4>,
      );
      return;
    }

    if (line.startsWith('- ')) {
      blocks.push(
        <p className="pl-4 text-base leading-7 text-text-muted" key={index}>
          <span aria-hidden="true" className="mr-2 text-primary">
            -
          </span>
          {line.replace('- ', '')}
        </p>,
      );
      return;
    }

    blocks.push(
      <p className="text-base leading-7 text-text-muted" key={index}>
        {line}
      </p>,
    );
  });

  return <div className="space-y-4">{blocks}</div>;
}
