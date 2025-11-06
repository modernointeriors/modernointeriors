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
        <span key={`text-${key++}`} className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add bold part
    parts.push(
      <strong key={`bold-${key++}`} className="font-semibold break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        {match[1]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${key++}`} className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
}

/**
 * Parse text and convert *text* to <strong>text</strong> HTML
 * Also convert (image-url) to <img> tags
 * For use with dangerouslySetInnerHTML
 */
export function parseBoldTextToHTML(text: string): string {
  if (!text) return '';
  
  // First, convert *text* to bold
  let html = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  
  // Then, convert (image-url) to <img> tags
  // Match URLs in parentheses that end with image extensions
  html = html.replace(/\(([^)]+\.(?:png|jpg|jpeg|gif|webp|svg))\)/gi, (match, url) => {
    return `<img src="${url}" alt="Content image" class="max-w-full h-auto my-4 rounded-lg" />`;
  });
  
  return html;
}

/**
 * Component wrapper for rendering text with bold formatting
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  return <span className={`break-words ${className || ''}`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{parseBoldText(text)}</span>;
}
