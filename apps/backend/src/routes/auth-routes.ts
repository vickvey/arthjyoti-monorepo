import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/controllers/auth-controller";

const router = Router();

router.post("/sign-up", registerUser);

router.post("/sign-in", loginUser);

router.post("/sign-out", logoutUser);

router.post("/refresh", refreshAccessToken);

export default router; // authRouter
