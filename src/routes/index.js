import express from "express";
import userApi from "./userApi.js";
import authApi from "./authApi.js";

const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);

export default router;
