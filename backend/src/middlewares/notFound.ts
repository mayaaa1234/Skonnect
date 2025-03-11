import type { Request, Response, NextFunction } from "express";

export const notFound = (_req: Request, res: Response) =>
  res.status(404).send("Route does not exist.");

//export default notFound;
