import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import videoRouter from './routes/videoRouter.routes.js'
import healthcheck from './routes/healthcheck.routes.js'
import comment from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

app.use("/api/v1/health-check", healthcheck)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/video-comment", comment)
app.use("/api/v1/likes", likeRouter)

export { app } 