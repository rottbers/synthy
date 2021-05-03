import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';
import { Client, query as q } from 'faunadb';
import { Recording } from '../../../shared/types';

if (!process.env.FAUNADB_SECRET) throw new Error('FAUNADB_SECRET is undefined');
const client = new Client({ secret: process.env.FAUNADB_SECRET });

export default async function (request: Req, response: Res) {
  const { method, query: { recordingId } } = request; // prettier-ignore

  if (method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    response.status(405).json({ message: `Method ${method} not allowed` });
    return;
  }

  try {
    const { data }: { data: Recording } = await client.query(q.Get(q.Ref(q.Collection('recordings'), recordingId))); // prettier-ignore

    response.status(200).json({ message: 'Success', data });
  } catch ({ message }) {
    response.status(500).json({ message });
  }
}
