'use client';

import SafeImage from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditIcon, MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashIcon } from './icons';
import type { CustomGPT } from '@/lib/db/schema';

export default function GPTHeader(gpt: CustomGPT) {
  return (
    <Card className="hover:shadow-sm transition-shadow border-0">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <div className="size-16 relative rounded-md overflow-hidden bg-muted">
          <SafeImage src={gpt.image} alt={gpt.name} height={64} width={64} />
        </div>
        <div className="flex-1">
          <CardTitle className="text-base">{gpt.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{gpt.description}</p>
        </div>
        <div className="flex gap-2 ml-auto items-center">
          <Link href={`/gpts/editor?g=${gpt.id}`}>
            <EditIcon />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem className="text-red-500">
                <Button variant="ghost">
                  <TrashIcon /> Delete GPT
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  );
}
