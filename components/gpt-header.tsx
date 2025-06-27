'use client';

import SafeImage from '@/components/safe-image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { CustomGPT } from '@/lib/db/schema';
import { motion } from 'framer-motion';

export default function GPTHeader({ gpt }: { gpt: CustomGPT }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.3 }}
      className="text-2xl font-semibold"
    >
      <Card className="hover:shadow-sm transition-shadow border-0">
        <CardHeader className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="size-16 relative rounded-md overflow-hidden bg-muted">
            <SafeImage src={gpt.image} alt={gpt.name} height={64} width={64} />
          </div>
          <div className="flex-1 text-center">
            <CardTitle className="text-base">{gpt.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{gpt.description}</p>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
