import { Response, Request } from "miragejs";
import { User } from "../../../interfaces/user.interface";
import { randomBytes } from "crypto";
import { handleErrors } from "../server";

const generateToken = () => randomBytes(8).toString("hex");

export interface AuthResponse {
  user: User;
  token: string;
}

export const logIn = (
  schema: any,
  request: Request
): AuthResponse | Response => {
  const { username, password } = JSON.parse(request.requestBody);

  const user = schema.users.findBy({ username: username });

  if (!user) return handleErrors(null, "No user with such username exists");
  if (password !== user.password)
    return handleErrors(null, "Incorrect password");

  const token = generateToken();
  return {
    user: user,
    token: token,
  };
};

export const signUp = (
  schema: any,
  request: Request
): AuthResponse | Response => {
  const data = JSON.parse(request.requestBody);
  const exUser = schema.users.findBy({ username: data.username });

  if (exUser)
    return handleErrors(null, "A user with such Username already exists");

  const user = schema.users.create(data);
  const token = generateToken();
  return {
    user: user.attrs as User,
    token: token,
  };
};
