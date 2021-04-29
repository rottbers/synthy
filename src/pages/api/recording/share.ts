import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';
import { Client, query as q } from 'faunadb';
import { Recording, RecordingShareBody } from '../../../shared/types';

//@ts-expect-error TODO
const client = new Client({ secret: process.env.FAUNADB_SECRET });

export default async function (request: Req, response: Res) {
  const { method, body } = request;

  if (method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    response.status(405).json({ message: `Method ${method} not allowed` });
    return;
  }

  try {
    const { duration, notes, settings }: RecordingShareBody = JSON.parse(body);

    if (!duration || !notes?.length || !settings) {
      response
        .status(400)
        .json({ message: 'notes, duration, settings required' });
      return;
    }

    const data: Recording = {
      notes,
      duration,
      settings,
      city: null,
      date: new Date(Date.now()).toISOString(), // TODO: use db timestamp
    };

    const { ref: { id: recordingId } }: { ref: { id: string } } = await client.query(q.Create(q.Collection('recordings'), { data })); // prettier-ignore

    response.status(200).json({ message: 'Success', recordingId });
  } catch ({ message }) {
    response.status(500).json({ message });
  }
}
