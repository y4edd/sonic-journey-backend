export interface AuthDTO {
  email: string;
  password: string;
}

export interface RequestWithCookies extends Request {
  cookies: {
    access_token: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ペイロードの中身を把握し、型を教えておく
export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthorizationPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface RequestWithAuthorizationHeader extends Request {
  user: string;
}
