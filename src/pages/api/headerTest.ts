import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';

export default async function (request: Req, response: Res) {
  const { headers } = request;

  response.status(200).json({ headers });
}
