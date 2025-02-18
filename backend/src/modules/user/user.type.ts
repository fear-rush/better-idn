export type User = {
  id: string;
  username: string;
}

export type UserWithPassword = User & {
  email: string;
  password: string;
}