import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel Id")
    }

    // Ensure the channel exists
    const channelExists = await User.findOne({ _id: channelId })
    if (!channelExists) {
        throw new ApiError(404, "Channel not found")
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ subscriber: userId, channel: channelId })
    if (existingSubscription) {
        await existingSubscription.deleteOne()
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
    } else {
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })

        return res.status(200).json(
            new ApiResponse(200, newSubscription, "Subscribed successfully")
        )
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscribedId } = req.params

    if (!mongoose.Types.ObjectId.isValid(subscribedId)) {
        throw new ApiError(400, "Invalid channel Id")
    }

    // Find the subscriptions where the channel is the subscribedId
    const subscription = await Subscription.find({ subscriber: new mongoose.Types.ObjectId(subscribedId) })
    if (subscription.length === 0) {
        throw new ApiError(400, "Channel doesn't exists")
    }

    const subscriberCount = await Subscription.aggregate(
        [
            { $match: { subscriber: new mongoose.Types.ObjectId(subscribedId) } },
            { $count: "totalSubscribers" }
        ]
    )

    const count = subscriberCount.length > 0 ? subscriberCount[0].totalSubscribers : 0;

    return res.status(201).json(
        new ApiResponse(201, { subscriberCount: count }, "Channel subscriber count retrieved successfully")
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel Id")
    }

    const channelExists = await User.findById(channelId)
    if (!channelExists) {
        throw new ApiError(404, "User doesn't exists")
    }

    const subscribedCount = await Subscription.aggregate(
        [
            { $match: { subscriber: new mongoose.Types.ObjectId(channelId) } },
            { $count: "totalSubscribedChannels" }
        ]
    )
    
    const count = subscribedCount.length > 0 ? subscribedCount[0].totalSubscribed : 0

    return res.status(201).json(
        new ApiResponse(201, { subscribedCount: count }, "Channel subscribed count retrieved successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}