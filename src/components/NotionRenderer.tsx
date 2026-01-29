'use client';

import { NotionRenderer as NotionRendererOriginal } from 'react-notion-x';
import 'react-notion-x/src/styles.css';

interface NotionRendererProps {
  recordMap: any;
  fullPage?: boolean;
  darkMode?: boolean;
  className?: string;
}

export default function NotionRenderer({ recordMap, fullPage = false, darkMode = true, className }: NotionRendererProps) {
  return (
    <NotionRendererOriginal 
      recordMap={recordMap} 
      fullPage={fullPage} 
      darkMode={darkMode}
      className={className}
    />
  );
}
