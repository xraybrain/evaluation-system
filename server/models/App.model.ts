import { User } from '@prisma/client';
import { Request } from 'express';

export class LoginRequest {
  constructor(public email: string, public password: string) {}
}

export class VerifiedToken {
  constructor(public data: any, public expired: boolean) {}
}

export class CreateAccesTokenRequest {
  constructor(
    public userId: number,
    public userType: string,
    public userAgent: string
  ) {}
}

export class RefreshAccessTokenRequest {
  constructor(
    public id: string,
    public userId: number,
    public userType: string
  ) {}
}

export interface AppRequest extends Request {
  user?: User | null;
}

export class ChangePasswordRequest {
  constructor(public oldPassword: string, public newPassword: string) {}
}

export class ResetPasswordRequest {
  constructor(public email: string) {}
}
