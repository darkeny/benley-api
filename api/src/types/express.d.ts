// src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
  userId: string;
  role: 'ADMIN' | 'USER'; // Tipos de role específicos para o seu caso
}

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload; // Agora a tipagem é mais específica
    }
  }
}
