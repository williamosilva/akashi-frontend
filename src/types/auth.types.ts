export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  fullName: string;
  photo: string;
  email: string;
}
