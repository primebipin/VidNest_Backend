import { Router } from 'express';
import {
    createAComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); 

router.route("/:videoId").get(getVideoComments).post(createAComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router