import React from 'react';

function formatInline(text: string, isUser: boolean): React.ReactNode[] {
  // Regex to match markdown tokens: bold **...**, code `...`, italics *...*, links [label](url), emails
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\*[^*\n]+?\*|\[.*?\]\(.*?\)|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {boldText}
        </strong>
      );
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] select-all ${
            isUser ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#477415] border border-stone-200/80 font-bold'
          }`}
        >
          {codeText}
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {italicText}
        </em>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target={url.startsWith('http') ? '_blank' : '_self'}
          rel={url.startsWith('http') ? 'noreferrer noopener' : undefined}
          className={`underline font-semibold hover:opacity-80 transition ${
            isUser ? 'text-white underline-offset-2' : 'text-[#558b1a] underline-offset-2'
          }`}
        >
          {label}
        </a>
      );
    }

    // Email address
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className={`underline hover:opacity-80 transition font-medium ${
            isUser ? 'text-white' : 'text-[#558b1a]'
          }`}
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

export default function FormattedChatMessage({
  content,
  isUser = false,
}: {
  content: string;
  isUser?: boolean;
}) {
  if (!content) return null;
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const rawLines = para.split('\n').filter((l) => l.trim().length > 0);

        // Check if paragraph is entirely a bullet list
        const isBulletList =
          rawLines.length > 0 &&
          rawLines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        const isNumberedList =
          rawLines.length > 0 && rawLines.every((l) => /^\d+\.\s/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 my-1 pl-1">
              {rawLines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-1.5 text-xs leading-relaxed">
                    <span
                      className={`text-[10px] mt-0.5 select-none shrink-0 ${
                        isUser ? 'text-emerald-300' : 'text-[#558b1a]'
                      }`}
                    >
                      •
                    </span>
                    <div>{formatInline(itemText, isUser)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="space-y-1.5 my-1 pl-1">
              {rawLines.map((line, lIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const itemText = match ? match[2] : line;
                return (
                  <li key={lIdx} className="flex items-start gap-1.5 text-xs leading-relaxed">
                    <span
                      className={`text-[10px] font-bold mt-0.5 select-none shrink-0 ${
                        isUser ? 'text-emerald-300' : 'text-[#558b1a]'
                      }`}
                    >
                      {num}.
                    </span>
                    <div>{formatInline(itemText, isUser)}</div>
                  </li>
                );
              })}
            </ol>
          );
        }

        const lines = para.split('\n');
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {formatInline(line, isUser)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
