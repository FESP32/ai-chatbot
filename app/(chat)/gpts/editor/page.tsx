import GPTForm from '@/components/gpt-form';
import { getGPTById } from '@/lib/db/queries';
import type { CustomGPT } from '@/lib/db/schema';

export default async function Page(props: {
  searchParams: Promise<{ g: string }>;
}) {
  const searchParams = await props.searchParams;
  const g = searchParams?.g;

  let customGPT: CustomGPT | undefined = undefined;

  if (g) {
    customGPT = await getGPTById({ id: g });
  }

  return (
    <>
      <GPTForm gpt={customGPT} />
    </>
  );
}
