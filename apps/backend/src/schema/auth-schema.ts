import { string, z } from "zod";

export const authRegistrationSchema = z.object({
  email: string().email().nonempty(),
  password: string().min(6).max(50).nonempty(),
});

export const authLoginSchema = z.object({
  email: string().email().nonempty(),
  password: string().min(6).max(50).nonempty(),
});
