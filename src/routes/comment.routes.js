import { Router } from "express";
import {
    getVideoComments,
    addVideoComment,
    deleteVideoComment,
    updateVideoComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/:videoId").get(getVideoComments).post(addVideoComment)
router.route("/comment/:commentId").delete(deleteVideoComment).patch(updateVideoComment)

export default router