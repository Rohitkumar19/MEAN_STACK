const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const postController = require('../controllers/posts')
const extractFile = require("../middleware/file");

//Sample Post Method
router.post(
  "",
  checkAuth,
  extractFile,
  postController.createPost
);

router.put(
  "/:id",
  checkAuth,
  extractFile,
  postController.updatePost
);

//Sample Get Method
router.get("", postController.getPost);

router.get("/:id", postController.getSinglePost);

/**
 * Sample Delete method
 * :id -> This indicates Dynamic field it will automatically extract by express
 *  */
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
