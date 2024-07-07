import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { toggleId } = req.params
    const userId = req.user._id

    if (!toggleId) {
        throw new ApiError(400, "Missing toggleId")
    }

    const existingLike = await Like.findOne({
        video: toggleId,
        likedBy: userId
    })

    if (existingLike) {
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(200, null, "Unliked Successfully"))
    } else {
        const newLike = await Like.create({
            video: toggleId,
            likedBy: userId
        })

        return res.status(201).json(new ApiResponse(201, newLike, "Liked Successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { toggleId } = req.params
    const userId = req.user._id

    if (!toggleId) {
        throw new ApiError(400, "Missing toggleId")
    }

    const existingLike = await Like.findOne({
        comment: toggleId,
        likedBy: userId
    })

    if (existingLike) {
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(200, null, "Unliked Successfully"))
    } else {
        const newLike = await Like.create({
            comment: toggleId,
            likedBy: userId
        })

        return res.status(201).json(new ApiResponse(201, newLike, "Liked Successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { toggleId } = req.params
    const userId = req.user._id

    if (!toggleId) {
        throw new ApiError(400, "Missing toggleId")
    }

    const existingLike = await Like.findOne({
        tweet: toggleId,
        likedBy: userId
    })

    if (existingLike) {
        await existingLike.remove()
        return res.status(200).json(new ApiResponse(200, null, "Unliked Successfully"))
    } else {
        const newLike = await Like.create({
            tweet: toggleId,
            likedBy: userId
        })

        return res.status(201).json(new ApiResponse(201, newLike, "Liked Successfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const likes = await Like.find({ likedBy: userId })

    if (!likes || likes.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No liked videos found"))
    }

    const likedVideos = likes.map(like => like.video)

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}