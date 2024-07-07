import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/toggle/v/:toggleId").post(toggleVideoLike)
router.route("/toggle/c/:toggleId").post(toggleCommentLike)
router.route("/toggle/t/:toggleId").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)

export default router