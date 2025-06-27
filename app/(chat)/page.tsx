import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';
import { getGPTById } from '@/lib/db/queries';
import type { CustomGPT } from '@/lib/db/schema';

export default async function Page(props: {
  searchParams: Promise<{ g: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const searchParams = await props.searchParams;
  const g = searchParams?.g;

  let customGPT: CustomGPT | undefined = undefined;

  if (g) {
    customGPT = await getGPTById({ id: g });
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={customGPT ? customGPT.model : DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
          customGPT={customGPT}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
        customGPT={customGPT}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
