// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MovementResult } from '../../components/interfaces/movement'


type Data = {
  movementResult: MovementResult;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ movementResult: "Fallen" });
}
