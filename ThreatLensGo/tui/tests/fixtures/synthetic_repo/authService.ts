export interface AuthToken {
  token: string;
  expiresIn: number;
}

export class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  public async generateToken(userId: string): Promise<AuthToken> {
    return {
      token: `jwt_${userId}_${Date.now()}`,
      expiresIn: 3600,
    };
  }

  public validateToken(token: string): boolean {
    return token.startsWith('jwt_');
  }
}
