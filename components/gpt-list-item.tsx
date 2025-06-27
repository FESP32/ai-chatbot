'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { TrashIcon } from './icons';
import type { CustomGPT } from '@/lib/db/schema';
import { toast } from '@/components/toast';
import { useGptContext } from '@/lib/context/gpt-context';

export default function GPTListItem(gpt: CustomGPT) {
  const { refreshGpts } = useGptContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(`Delete "${gpt.name}"?`);
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/gpts?id=${gpt.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete GPT');
      }

      toast({
        type: 'success',
        description: 'GPT deleted!',
      });

      refreshGpts(); // update the context after deletion
    } catch (error) {
      toast({
        type: 'success',
        description: 'Error deleting GPT!',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow border-0">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <div className="size-16 relative rounded-md overflow-hidden">
          <SafeImage src={gpt.image} alt={gpt.name} height={64} width={64} />
        </div>
        <div className="flex-1">
          <CardTitle className="text-base">{gpt.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{gpt.description}</p>
        </div>
        <div className="flex gap-2 ml-auto items-center">
          <Button variant="ghost" disabled={isDeleting}>
            <Link href={`/gpts/editor?g=${gpt.id}`}>
              <EditIcon />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" disabled={isDeleting}>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-500 cursor-pointer"
              >
                <TrashIcon /> {isDeleting ? 'Deleting...' : 'Delete GPT'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  );
}
