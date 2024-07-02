import mongoose ,{isValidObjectId} from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req,res)=>{
   const {videoId} = req.params

   if(!isValidObjectId(videoId)){
      throw new ApiError(400, "Invalid video id")
   }

   const likedVideo = await Like.findOne(
      {
         video : videoId,
         likedBy: req.user?._id
      }
   )

   if(likedVideo){
      await Like.findByIdAndDelete(likedVideo?._id)

      return res
      .status(200)
      .json(
         new ApiResponse(200,{isLiked : false}, "Video is disliked successfully")
      )
   }

   await Like.create(
      {
         video : videoId,
         likedBy : req.user?._id
      }
   )

   return res
   .status(200)
   .json(
       new ApiResponse(200, { isLiked: true }, "Video Liked successfully")
   )

})

const toggleCommentLike = asyncHandler(async (req,res)=>{
   const {commentId} = req.params

   if(!isValidObjectId(commentId)){
      throw new ApiError(400,"Invalid comment id")
   }

   const likedComment = await Like.findOne(
      {
         comment: commentId,
         likedBy: req.user?._id
      }
   )

   if(likedComment){
      await Like.findByIdAndDelete(likedComment?._id)
      return res
      .status(200)
      .json(
         new ApiResponse(200, { isLiked: false }, "Comment disliked successfully")
      )
   }

   await Like.create(
      {
          comment: commentId,
          likedBy: req.user?._id
      }
  )

  return res
  .status(200)
  .json(
      new ApiResponse(200, { isLiked: true }, "comment liked successfully")
  )
})

const getLikedVideos = asyncHandler(async (req, res) => {

   try {
     const userId = new mongoose.Types.ObjectId(req.user?._id,100);
    const likedVideosAggegate = await Like.aggregate([
        {
            $match: {
                likedBy: userId
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                        },
                    },
                    {
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1,
                    },
                },
            },
        },
    ]);
 
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggegate,
                "liked videos fetched successfully"
            )
        )
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }
   })

export {
   toggleVideoLike,
   toggleCommentLike,
   getLikedVideos
}