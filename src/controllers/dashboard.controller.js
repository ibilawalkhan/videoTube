import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(401, "Unathorized user")
    }

    // Total Videos and Views
    const videos = await Video.find({ owner: userId })
    let totalVideos = videos.length
    let totalViews = videos.reduce((acc, video) => acc + video.views, 0)

    // Get video ids owned by user
    const videoIds = videos.map(video => video._id)

    // Total likes
    const likes = await Like.find({ video: { $in: videoIds } })
    let totalLikes = likes.length

    // Total subscribers
    let subscribers = await Subscription.find({ channel: userId })
    let totalSubscribers = subscribers.length

    const stats = {
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers
    }

    return res.status(200).json(
        new ApiResponse(200, stats, "Stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(401, "Unathorized user")
    }

    const videos = await Video.find({ owner: userId })
    
    if(!videos) {
        throw new ApiError(404, "No videos found for the channel")
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )

})

export {
    getChannelStats,
    getChannelVideos
}