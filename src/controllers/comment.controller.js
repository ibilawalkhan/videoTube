import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const comments = await Comment.find({ video: videoId })

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const addVideoComment = asyncHandler(async (req, res) => {
    const { content, video, owner } = req.body

    if (!content || !video || !owner) {
        throw new ApiError(400, "All fields are required")
    }

    const comment = await Comment.create({
        content,
        video: video,
        owner
    })

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding comment")
    }

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully"))
})

const updateVideoComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true })

    if (!updatedComment) {
        throw new ApiError(500, "Something went wrong while updating comment")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})

const deleteVideoComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    console.log("deletedComment: ", deletedComment)
    if (!deletedComment) {
        throw new ApiError(500, "Something went wrong while deleting comment")
    }

    res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addVideoComment,
    updateVideoComment,
    deleteVideoComment
}