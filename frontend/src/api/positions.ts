import { http } from "../lib/http";
import type { Position, PositionCreate } from "../types/domain";

export async function listPositions(): Promise<Position[]> {
  const res = await http.get<Position[]>("/positions");
  return res.data;
}

export async function createPosition(
  payload: PositionCreate,
): Promise<Position> {
  const res = await http.post<Position>("/positions", payload);
  return res.data;
}
