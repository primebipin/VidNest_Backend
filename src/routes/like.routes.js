import { Router } from "express";
import { 
   toggleVideoLike ,
   toggleCommentLike,
   // toggleTweetLike,
   getLikedVideos
} from "../controllers/like.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
// router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
export default router