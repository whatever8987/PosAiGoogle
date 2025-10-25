import React, { useState } from 'react';
import { Clipboard, Check, Database } from 'lucide-react';
import type { Theme } from '../types';

interface SqlDisplayProps {
  sql: string;
  theme: Theme;
}

const highlightSql = (sql: string) => {
    return sql.replace(
        /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|JOIN|ON|AS|SUM|COUNT|AVG|DESC|ASC|CREATE|TABLE|SERIAL|PRIMARY|KEY|VARCHAR|INT|DECIMAL|TIMESTAMP|DEFAULT|NOT|NULL|FOREIGN)\b/gi,
        '<span class="text-sky-500 dark:text-sky-400 font-semibold">$1</span>'
    );
};


export const SqlDisplay: React.FC<SqlDisplayProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedSql = highlightSql(sql);

  return (
    <div>
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
          <Database className="w-4 h-4 mr-2" />
          Generated SQL Query
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Clipboard className="w-3 h-3 mr-1" /> Copy SQL
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-900">
        <code dangerouslySetInnerHTML={{ __html: highlightedSql }} />
      </pre>
    </div>
  );
};