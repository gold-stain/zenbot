import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => (
  <div className={`prose-zensar ${className || ""}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p className="leading-relaxed mb-3 last:mb-0" {...props} />,
        a: ({ node, ...props }) => (
          <a {...props} className="text-[#FF6B5B] underline-offset-2 hover:underline" target="_blank" rel="noreferrer" />
        ),
        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
        em: ({ node, ...props }) => <em className="text-white/80 italic" {...props} />,
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-[#FF6B5B] font-mono text-[12px]" {...props} />
          ) : (
            <code className="block p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[12px] overflow-x-auto" {...props} />
          ),
        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-3" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-3" {...props} />,
        h1: ({ node, ...props }) => <h3 className="font-display font-bold text-xl mt-2 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h4 className="font-display font-semibold text-lg mt-2 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h5 className="font-display font-semibold mt-2 mb-1.5" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-2 border-white/15 pl-3 text-white/70 italic my-3" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);
