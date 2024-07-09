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
        throw new ApiError(404, 'Playlists not found')
    }

    res.status(200).json(new ApiResponse(200, playlists, 'Playlists fetched successfully'))
})

const getUserPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    res.status(200).json(new ApiResponse(200, playlist, 'Playlist fetched successfully'))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => { })

const removeVideoFromPlaylist = asyncHandler(async (req, res) => { })

const deletePlaylist = asyncHandler(async (req, res) => { })

const deleteAllPlaylists = asyncHandler(async (req, res) => { })

const updatePlaylist = asyncHandler(async (req, res) => { })

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