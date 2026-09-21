import type { IncomingMessage, ServerResponse } from 'http';
import handler from './handler';

export default function api(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
