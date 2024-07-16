import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, 'Please provide all the values')
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(500, 'Something went wrong while creating playlist')
    }

    res.status(201).json(new ApiResponse(201, playlist, 'Playlist created successfully'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const playlists = await Playlist.find({ owner: userId })

    if (!playlists) {
        throw new ApiError([], 'Playlists not found')
    }

    res.status(200).json(new ApiResponse(200, playlists, 'Playlists fetched successfully'))
})

const getUserPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    res.status(200).json(new ApiResponse(200, playlist, 'Playlist fetched successfully'))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params


    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    const VideoAdded = await Playlist.findByIdAndUpdate(playlistId, {
        $push: {
            videos: videoId
        }
    })

    if (!VideoAdded) {
        throw new ApiError(500, 'Something went wrong while adding video to playlist')
    }

    return res.status(200).json(
        new ApiResponse(200, VideoAdded, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params


    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    const VideoRemoved = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {
            videos: videoId
        }
    })

    if (!VideoRemoved) {
        throw new ApiError(500, 'Something went wrong while removing video from playlist')
    }

    return res.status(200).json(
        new ApiResponse(200, VideoRemoved, "Video removed from playlist successfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const deletededPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletededPlaylist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res.status(200).json(
        new ApiResponse(200, deletededPlaylist, "Playlist deleted successfully")
    )
})

const deleteAllPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const deletededPlaylists = await Playlist.deleteMany({ owner: userId })

    if (!deletededPlaylists) {
        throw new ApiError([], 'Playlists not found')
    }

    return res.status(200).json(
        new ApiResponse(200, deletededPlaylists, "Playlists deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        name,
        description
    }, { new: true })

    if (!updatedPlaylist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getUserPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    deleteAllPlaylists,
    updatePlaylist
}