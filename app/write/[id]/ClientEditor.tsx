'use client';

import dynamic from 'next/dynamic';
import { EditorSkeleton } from './EditorSkeleton';

// 임시 저장된 글(localStorage)을 첫 렌더링부터 읽기 위해 에디터는 브라우저에서만 그림
export const ClientEditor = dynamic(() => import('./Editor').then((m) => m.Editor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
