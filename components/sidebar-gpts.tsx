'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Squares2x2Icon, LoaderIcon } from '@/components/icons';
import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import SafeImage from './safe-image';
import { useGptContext } from '@/lib/context/gpt-context';

export function SidebarGpts() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { setOpenMobile } = useSidebar();

  const { gpts, loading, error } = useGptContext();

  return (
    <div className="p-2">
      <SidebarMenu>
        <Link
          href="/gpts"
          onClick={() => setOpenMobile(false)}
          className="flex flex-row gap-2 items-center px-2 py-1 hover:bg-muted rounded-md"
        >
          <Squares2x2Icon size={18} />
          <span className="text-sm">GPTs</span>
        </Link>
      </SidebarMenu>

      {status === 'loading' ? (
        <SidebarMenu>
          <div className="flex flex-row items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
            <div className="animate-spin">
              <LoaderIcon />
            </div>
            <span>Loading session...</span>
          </div>
        </SidebarMenu>
      ) : !user ? (
        <SidebarMenu>
          <div className="text-sm text-muted-foreground px-4 py-1">
            Login to view GPTs
          </div>
        </SidebarMenu>
      ) : loading ? (
        <SidebarMenu>
          <div className="flex flex-row items-center gap-2 px-4 py-1 text-sm text-muted-foreground">
            <div className="animate-spin">
              <LoaderIcon />
            </div>
            <span>Loading GPTs...</span>
          </div>
        </SidebarMenu>
      ) : error || gpts.length === 0 ? (
        <SidebarMenu>
          <div className="text-sm text-muted-foreground px-4 py-1">
            {error || 'No GPTs found.'}
          </div>
        </SidebarMenu>
      ) : (
        gpts.map((gpt) => (
          <SidebarMenu key={gpt.id}>
            <Link
              href={`/?g=${gpt.id}`}
              onClick={() => setOpenMobile(false)}
              className="flex flex-row gap-3 items-center px-2 py-1 hover:bg-muted rounded-md"
            >
              <div className="relative size-5 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <SafeImage
                  src={gpt.image}
                  alt={gpt.name}
                  height={18}
                  width={18}
                />
              </div>
              <span className="text-sm truncate">{gpt.name}</span>
            </Link>
          </SidebarMenu>
        ))
      )}
    </div>
  );
}
