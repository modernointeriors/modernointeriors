// Utility functions for text formatting

/**
 * Parse text and convert *text* to bold formatting
 * Example: "This is *bold* text" -> "This is <strong>bold</strong> text"
 */
export function parseBoldText(text: string): JSX.Element[] {
  if (!text) return [];
  
  const parts: JSX.Element[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${key++}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add bold part
    parts.push(
      <strong key={`bold-${key++}`} className="font-semibold">
        {match[1]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${key++}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
}

/**
 * Parse text and convert *text* to <strong>text</strong> HTML
 * For use with dangerouslySetInnerHTML
 */
export function parseBoldTextToHTML(text: string): string {
  if (!text) return '';
  return text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
}

/**
 * Component wrapper for rendering text with bold formatting
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{parseBoldText(text)}</span>;
}
