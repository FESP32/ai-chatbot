import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import GptList from '@/components/gpt-list';

export default async function Page() {
  return (
    <div className="w-1/2 mx-auto px-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My GPTs</h1>
      </div>

      <Link
        href="/gpts/editor"
        className="font-semibold text-gray-800 dark:text-zinc-200 focus:outline-none "
        style={{ textDecoration: 'none' }}
      >
        <Card className="transition-shadow border-0 hover:bg-accent hover:text-foreground">
          <CardHeader className="flex flex-row  items-center gap-4 p-4">
            <div className="flex ">
              <div className="flex size-16 rounded-full border-dashed border-2 items-center justify-center border-white">
                +
              </div>

              <div className="flex flex-col text-left justify-center ml-2">
                <CardTitle className="text-base">Create a GPT</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize a version of ChatGPT for a specific purpose
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <div className="space-y-4">
        <GptList />
      </div>
    </div>
  );
}
