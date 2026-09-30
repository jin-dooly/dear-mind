import { redirect } from 'next/navigation';
import { getQuestion } from '@/app/lib/db';
import { Editor } from './Editor';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestion(id);
  if (!question) redirect('/write');

  return <Editor question={question} />;
}
