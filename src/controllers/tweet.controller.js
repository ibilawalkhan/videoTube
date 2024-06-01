import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from '../models/tweet.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
    const { content, owner } = req.body
    console.log("Content: " + content + ", onwer: " + owner)

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
        throw new ApiError(400, "Valid owner is required")
    }

    const tweet = await Tweet.create({
        content,
        owner
    })

    const createdTweet = await Tweet.findById(tweet._id)

    if (!createdTweet) {
        throw new ApiError(500, "Something went wrong while creating tweet")
    }

    return res.status(201).json(
        new ApiResponse(201, createTweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const tweets = await Tweet.find({ owner: userId })
    console.log("tweets: ", tweets)

    if (!tweets) {
        throw new ApiError(404, "No tweets found for this user")
    }

    return res.status(201).json(
        new ApiResponse(201, tweets, "User tweets retrieved successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const tweetId = req.params.tweetId

    if (!content) {
        throw new ApiError(400, "Content of tweet is required")
    }

    // const tweet = await Tweet.findById(tweetId)
    // tweet.content = content
    // await tweet.save()

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        { new: true }
    )


    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updates successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params?.tweetId

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId, { new: true })

    if (!tweet) {
        throw new ApiError(403, "Tweet not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}