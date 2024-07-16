import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getUserPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    deleteAllPlaylists
} from "../controllers/playlist.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlaylist)

router
    .route("/:playlistId")
    .get(getUserPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").delete(removeVideoFromPlaylist)
router.route("/delete/all").delete(deleteAllPlaylists)
router.route("/user/:userId").get(getUserPlaylists)

export default router