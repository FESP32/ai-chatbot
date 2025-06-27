'use client';

import { useSession } from 'next-auth/react';
import { LoaderIcon } from './icons';
import GPTListItem from './gpt-list-item';
import { useGptContext } from '@/lib/context/gpt-context';

export default function GptList() {
  const { data: session } = useSession();
  const user = session?.user;

  const { gpts, loading, error } = useGptContext();

  if (!user) {
    return (
      <div className="px-2 text-zinc-500 text-sm flex justify-center">
        Login to view your GPTs
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
        <div className="animate-spin">
          <LoaderIcon />
        </div>
        <span>Loading your GPTs...</span>
      </div>
    );
  }

  if (error || gpts.length === 0) {
    return (
      <div className="px-2 text-zinc-500 text-sm flex justify-center text-center my-4">
        {error || 'No GPT agents found. Create one to get started!'}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {gpts.map((gpt) => (
        <GPTListItem
          key={gpt.id}
          id={gpt.id}
          name={gpt.name}
          description={gpt.description}
          createdAt={gpt.createdAt}
          userId={user.id}
          image={gpt.image}
          instructions={gpt.instructions}
          model={gpt.model}
        />
      ))}
    </div>
  );
}
