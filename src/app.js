import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app= express();

const allowedOrigins = [
   'http://localhost:5173',
   'https://vid-nest-frontend-chi.vercel.app'
];

const corsOptions = {
   origin: function (origin, callback) {
       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
           callback(null, true);
       } else {
           callback(new Error('Not allowed by CORS'));
       }
   },
   credentials: true, // If you want to send cookies with requests
};

app.use(cors(corsOptions));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import tweetRouter from "./routes/tweet.routes.js"


// routes declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/tweets", tweetRouter)




// http://localhost:8000/api/v1/users/register
export { app }

