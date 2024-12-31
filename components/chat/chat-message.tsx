import { Message } from "ai";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400 hover:text-gray-100" />
        )}
      </button>
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <Card
        className={cn(
          "max-w-[80%] p-4",
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-2xl font-bold mb-4" {...props}/>
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-xl font-bold mb-3" {...props}/>
              ),
              p: ({node, ...props}) => (
                <p className="mb-2" {...props}/>
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc ml-4 mb-4" {...props}/>
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal ml-4 mb-4" {...props}/>
              ),
              code: ({node, inline, className, children, ...props}) => {
                if (inline) {
                  return (
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
                return <CodeBlock>{String(children)}</CodeBlock>;
              },
              a: ({node, ...props}) => (
                <a className="text-blue-500 hover:underline" {...props}/>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {isLoading && (
          <div className="animate-pulse mt-2 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/40"></div>
            <div className="h-2 w-2 rounded-full bg-primary/40"></div>
            <div className="h-2 w-2 rounded-full bg-primary/40"></div>
          </div>
        )}
      </Card>

      {message.role === "user" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}