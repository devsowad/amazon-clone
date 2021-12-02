import { ExtendedReq } from '@/src/types/ExtendedReq';
import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { NextHandler } from 'next-connect';
import db from '@/src/server/db';
import { UserModel } from '@/src/server/model/User';

export async function isAdmin(
  req: ExtendedReq,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req });
  if (!session) {
    return next({ status: 401, message: 'Unauthenticated' });
  }

  await db.connect();
  const user = await UserModel.findById(session.user.id);
  await db.disconnect();

  if (!user || !user.isAdmin) {
    return next({ statusCode: 401, message: 'Not authorized' });
  }

  req.user = user;

  next();
}
