import { auth } from '@/app/(auth)/auth';
import {
  deleteGPTById,
  getCustomGPTsByUserId,
  getGPTById,
  saveCustomGPT,
} from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customGPTId = searchParams.get('customGPTId');

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  if (!customGPTId) {
    const userCustomGPTs = await getCustomGPTsByUserId({
      id: session.user.id,
      limit: 5,
      endingBefore: null,
      startingAfter: null,
    });
    return Response.json(userCustomGPTs);
  }

  let customGPT: CustomGPT;

  try {
    customGPT = await getGPTById({ id: customGPTId });
  } catch {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (!customGPT) {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (customGPT.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  return Response.json(customGPT, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const customGPT = await getGPTById({ id });

  if (customGPT.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedGPT = await deleteGPTById({ id });

  return Response.json(deletedGPT, { status: 200 });
}

