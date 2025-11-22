import { Response } from "express";

export type Data = Record<string, any>;
export type Meta = Record<string, any>;

export class ResponseSender {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  private send(status: number, data: Data = {}, _meta: Meta = {}) {
    return this.res.status(status).json({
      Data: data,
      _Meta: _meta,
    });
  }

  response(data: Data = {}, _meta: Meta = {}) {
    return this.send(200, data, _meta);
  }

  badRequest(data: Data = {}, _meta: Meta = {}) {
    return this.send(400, data, _meta);
  }

  notFound(data: Data = {}, _meta: Meta = {}) {
    return this.send(404, data, _meta);
  }

  serverError(data: Data = {}, _meta: Meta = {}) {
    return this.send(500, data, _meta);
  }
}

export function createSender(res: Response) {
  return new ResponseSender(res);
}
