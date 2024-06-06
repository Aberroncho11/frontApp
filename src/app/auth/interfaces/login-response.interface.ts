import { User } from "./user.interface";

// LoginResponse interface
export interface LoginResponse {
  user:  User;
  token: string;
}

