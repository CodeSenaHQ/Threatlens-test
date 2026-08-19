import { AuthService } from './authService.js';

export class UserController {
  constructor(private authService: AuthService) {}

  public async login(username: string, pass: string): Promise<string> {
    const isValid = this.authService.validateToken('dummy');
    if (!isValid) throw new Error('Invalid credentials');
    const auth = await this.authService.generateToken(username);
    return auth.token;
  }
}

export const formatUserHeader = (user: string): string => {
  return `User: ${user.toUpperCase()}`;
};
