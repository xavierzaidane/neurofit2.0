import React, { useState } from "react";
import { Icon } from "./IconHelper";

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!content) return null;

  // Split content into code blocks and normal text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-white/95 break-words">
      {parts.map((part, index) => {
        // If it's a code block
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : "";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();
          const blockId = `code-${index}`;

          return (
            <div
              key={blockId}
              className="relative my-4 border border-white/10 bg-black/40 rounded-xl overflow-hidden shadow-2xl font-mono text-xs text-white/90"
            >
              {/* Code header bar */}
              <div className="flex justify-between items-center px-4 py-2 bg-white/[0.03] border-b border-white/5 text-[10px] text-white/40">
                <span className="uppercase tracking-wider font-semibold">{language || "text"}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(code, blockId)}
                  className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                >
                  <Icon name={copiedId === blockId ? "Check" : "Copy"} size={12} />
                  <span>{copiedId === blockId ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto whitespace-pre leading-normal select-text">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // If it's a normal text block, render line-by-line and parse simple markdown elements
        const lines = part.split("\n");
        let inList = false;
        let listItems: string[] = [];
        let inTable = false;
        let tableHeaders: string[] = [];
        let tableRows: string[][] = [];

        const elements: React.ReactNode[] = [];

        const renderTable = (headers: string[], rows: string[][], tableIndex: number) => {
          return (
            <div key={`table-${tableIndex}`} className="overflow-x-auto my-4 border border-white/10 rounded-xl">
              <table className="min-w-full divide-y divide-white/10 text-xs">
                <thead className="bg-white/[0.02]">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-4 py-2.5 text-left font-semibold text-white/70 tracking-wider">
                        {parseInlineStyles(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/[0.01]">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-white/80 whitespace-nowrap">
                          {parseInlineStyles(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        };

        const renderList = (items: string[], listIndex: number) => {
          return (
            <ul key={`list-${listIndex}`} className="list-disc pl-5 my-2 space-y-1.5 text-white/90">
              {items.map((item, i) => (
                <li key={i}>{parseInlineStyles(item)}</li>
              ))}
            </ul>
          );
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Table parser
          if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
            // End list if active
            if (inList) {
              elements.push(renderList(listItems, i));
              inList = false;
              listItems = [];
            }

            const cells = line
              .split("|")
              .map((c) => c.trim())
              .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);

            // Check if it's separator row (e.g. |---|---|)
            const isSeparator = cells.every((cell) => cell.startsWith(":") || cell.startsWith("-") || cell.endsWith("-"));

            if (isSeparator) {
              continue;
            }

            if (!inTable) {
              inTable = true;
              tableHeaders = cells;
              tableRows = [];
            } else {
              tableRows.push(cells);
            }
            continue;
          } else if (inTable) {
            // End of table
            elements.push(renderTable(tableHeaders, tableRows, i));
            inTable = false;
            tableHeaders = [];
            tableRows = [];
          }

          // Bullet lists
          const listMatch = line.match(/^[\s]*[\*\-]\s+(.*)/);
          if (listMatch) {
            if (inList) {
              listItems.push(listMatch[1]);
            } else {
              inList = true;
              listItems = [listMatch[1]];
            }
            continue;
          } else if (inList) {
            // End of list
            elements.push(renderList(listItems, i));
            inList = false;
            listItems = [];
          }

          // Headers
          const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
          if (headerMatch) {
            const level = headerMatch[1].length;
            const text = headerMatch[2];
            const headerClasses = [
              "text-xl font-bold tracking-tight text-white mt-4 mb-2",
              "text-lg font-semibold tracking-tight text-white mt-3 mb-2",
              "text-base font-semibold text-white mt-3 mb-1",
              "text-sm font-semibold text-white/80 mt-2 mb-1",
            ];
            const cls = headerClasses[level - 1] || headerClasses[3];
            elements.push(
              React.createElement(`h${level}`, { key: i, className: cls }, parseInlineStyles(text))
            );
            continue;
          }

          // Empty line
          if (!line.trim()) {
            elements.push(<div key={i} className="h-2" />);
            continue;
          }

          // Normal paragraph
          elements.push(
            <p key={i} className="my-1 selection:bg-[var(--foreground)]/30">
              {parseInlineStyles(line)}
            </p>
          );
        }

        // Flush remaining lists or tables at end of block
        if (inList) {
          elements.push(renderList(listItems, lines.length));
        }
        if (inTable) {
          elements.push(renderTable(tableHeaders, tableRows, lines.length));
        }

        return <React.Fragment key={index}>{elements}</React.Fragment>;
      })}
    </div>
  );
};

// Parses inline styles like bold (**), italic (*), inline code (`)
function parseInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let index = 0;

  // Split text by bold (**), italic (*), and inline code (`)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const matches = text.split(regex);

  return matches.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-white/90">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-[var(--foreground)] select-text">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Link parser [text](url)
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground)] hover:opacity-80 underline underline-offset-2 transition-colors duration-200 inline-flex items-center gap-0.5"
          >
            {match[1]}
            <Icon name="ExternalLink" size={10} className="inline" />
          </a>
        );
      }
    }
    return part;
  });
}

export default Markdown;
