import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';
import { Client, query as q } from 'faunadb';
import { whereAlpha2 } from 'iso-3166-1';
import { Recording, RecordingShareBody } from '../../../shared/types';

if (!process.env.FAUNADB_SECRET) throw new Error('FAUNADB_SECRET is undefined');
const client = new Client({ secret: process.env.FAUNADB_SECRET });

export default async function (request: Req, response: Res) {
  const { method, body, headers } = request;

  if (method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    response.status(405).json({ message: `Method ${method} not allowed` });
    return;
  }

  try {
    const { duration, notes, settings }: RecordingShareBody = JSON.parse(body);

    // TODO: validate body data
    if (!duration || !notes?.length || !settings) {
      response
        .status(400)
        .json({ message: 'notes, duration, settings is required' });
      return;
    }

    const alpha2 = headers['x-country'];
    const country = typeof alpha2 === 'string' ? whereAlpha2(alpha2)?.country ?? '' : ''; // prettier-ignore

    const data: Recording = {
      notes,
      duration,
      settings,
      country,
      date: new Date(Date.now()).toISOString(), // TODO: use db timestamp
    };

    const { ref: { id: recordingId } }: { ref: { id: number } } = await client.query(q.Create(q.Collection('recordings'), { data })); // prettier-ignore

    response.status(200).json({ message: 'Success', recordingId });
  } catch ({ message }) {
    response.status(500).json({ message });
  }
}
