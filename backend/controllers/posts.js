const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  //multer is used as middleware which tells that file will be single and name of key will be image
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      },
    });
  })//Mongoose schema functionality automatically save to db
    .catch((err) => {
      res.status(500).json({
        message: "Creating a post failed!"
      })
    })
  console.log(post);
}


exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then((result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "Updated Succesfully" });
    } else {
      res.status(401).json({ message: "Auth Failed" });
    }
  }).catch((err) => {
    res.status(500).json({
      message: "Internal Server Error"
    })
  })
}

exports.getPost = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  console.log("Process", process.env);
  postQuery
    .find()
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count(); //Promise chaining to find the count
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetch successfuly",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Fetching Post/s failed'
      })
    })
}

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: "Post Not Found" });
    }
  }).catch((err) => {
    res.status(500).json({
      message: 'Fetching Post failed'
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "Auth Failed" });
      }
    }
  ).catch((err) => {
    res.status(500).json({
      message: 'Delete Post failed'
    })
  })
}
