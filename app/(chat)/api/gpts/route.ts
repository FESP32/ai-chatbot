import { auth } from '@/app/(auth)/auth';
import {
  getGPTById,
  saveCustomGPT,
} from '@/lib/db/queries';

import { postRequestBodySchema, type PostRequestBody } from './schema';
import type { CustomGPT } from '@/lib/db/schema';
import { ChatSDKError } from '@/lib/errors';

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const { id, name, model, description, image, instructions } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    let customGPT: CustomGPT | null = null;
    if (id) {
      customGPT = await getGPTById({ id });
    }

    if (!customGPT) {
      const savedGPT = await saveCustomGPT({
        userId: session.user.id,
        name,
        description,
        instructions,
        model,
        image,
      });
      return Response.json(savedGPT, { status: 200 });
    } else {
      if (customGPT.userId !== session.user.id) {
        return new ChatSDKError('forbidden:chat').toResponse();
      }
      const savedGPT = await saveCustomGPT({
        id: customGPT.id,
        userId: session.user.id,
        name,
        description,
        instructions,
        model,
        image,
      });
      return Response.json(savedGPT, { status: 200 });
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
  }
}
