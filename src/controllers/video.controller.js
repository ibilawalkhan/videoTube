import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.body

    // Create filter object
    let filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    }

    if (userId) {
        filter.owner = userId
    }

    // Create sort object
    let sort = {}
    if (sortBy) {
        sort[sortBy] = sortType === 'desc' ? -1 : 1
    }

    // Pagination
    const skip = (page - 1) * limit

    // Fetch videos from the database
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)

    // Fetch total count of videos for pagination
    const totalVideos = await Video.countDocuments(filter)

    // Calculate total pages
    const totalPages = Math.ceil(totalVideos / limit)

    const response = {
        videos,
        totalVideos,
        totalPages,
        currentPage: page,
        pageSize: limit
    }

    return res.status(200).json(
        new ApiResponse(200, response, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { title, description, duration } = req.body

    if (!title || !description || !duration) {
        throw new ApiError(400, "All fields are required")
    }

    if (!req.files || !req.files.videoFile) {
        throw new ApiError(400, "Video file is required")
    }

    if (!req.files.thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoLocalPath = req.files?.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required, videoLocalPath")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required, thumbnailLocalPath")
    }

    const videoUrl = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoUrl) {
        throw new ApiError(400, "Video file is required, video")
    }

    if (!thumbnailUrl) {
        throw new ApiError(400, "Thumbnail file is required, thumbnail")
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUrl.url,
        duration,
        thumbnail: thumbnailUrl.url,
        owner: _id
    })

    return res.status(201).json(
        new ApiResponse(200, newVideo, "Video uploaded successfuly")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description, duration } = req.body

    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    if (!title || !description || !duration) {
        throw new ApiError(400, "All fields are required")
    }

    let videoUrl
    let thumbnailUrl

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (videoLocalPath) {
        videoUrl = await uploadOnCloudinary(videoLocalPath)
    }
    if (thumbnailLocalPath) {
        thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)
    }

    const updateFields = {
        title,
        description,
        duration,
        owner: req.user?._id
    }

    if (videoUrl) {
        updateFields.videoFile = videoUrl.url
    }
    if (thumbnailUrl) {
        updateFields.thumbnail = thumbnailUrl.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: updateFields,
    }, { new: true })

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            isPublished: true
        }
    }, { new: true })

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video publish status toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}