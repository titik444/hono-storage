import { User } from "@prisma/client";

export interface IUserModel {
  create(user: User): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<User>;
  restore(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  verifyUser(email: string, password: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<User[]>;
  count(request: {
    keyword: string;
    page: number;
    perPage: number;
  }): Promise<number>;
}
