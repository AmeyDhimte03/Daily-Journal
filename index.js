require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "'Daily Journal' is a personal journaling web application. Some of the key-features include ease of composing new journals, deleting the ones not necesary";
const aboutContent =
  "Hi I'm Amey Dhimte, a beginner developer who developed 'Daily Journal'. Thanks for using my website 😊";
const contactContent =
  "If you have any questions, complaints or feedback. please contact us at: Mail : ameydhimte03@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  }
);

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const BlogPost = mongoose.model("BlogPost", postSchema);

app.get("/", (req, res) => {
  BlogPost.find()
    .then((posts) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postName", (req, res) => {
  postTitle = _.lowerCase(req.params.postName);

  BlogPost.findOne({ title: postTitle })
    .then((post) => {
      res.render("post", { postTitle: postTitle, post: post });
    })
    .catch((err) => {
      console.log("Error while tryin to click on read me is: " + err);
    });

  // if(index!==-1){
  //   const blogTitle=posts[index].title;
  //   const blogContent=posts[index].body;
  //   res.render("post",{blogTitle:blogTitle,blogContent:blogContent});
  // }
  // else{ res.redirect("/");}
});

app.get("/sign-in-up",(req,res)=>{
  res.render("sign-in-up");
})

app.get("/sign-up",(req,res)=>{
  res.render('sign-up');
})

app.get("/sign-in",(req,res)=>{
  res.render("sign-in");
})


app.post("/compose", (req, res) => {
  let blogTitle = _.lowerCase(req.body.newBlogTitle);
  let blogBody = req.body.newBlogContent;

  let blog = new BlogPost({
    title: blogTitle,
    body: blogBody,
  });
  // posts.push(blog);
  blog
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error while publishing blog : " + err);
    });
});

app.post("/delete", (req, res) => {
  let blogTitle = _.lowerCase(req.body.blog_to_be_deleted);
  BlogPost.findOne({ title: blogTitle }).then((post) => {
    if (post.length === 0) {
      //post not found popup
      res.redirect("/");
    } else {
      BlogPost.deleteOne({ title: post.title })
        .then(() => {
          //successful deletion popup
          // console.log("succesful deletion of: "+post.title);
          res.redirect("/");
        })
        .catch((err) => {
          //unsuccessful deletion popup
          // console.log("Unsuccessful deleteion of: "+post.title);
          res.redirect("/");
        });
    }
  }).catch((error)=>{
    // console.log(blogTitle+" named post couldn't be deleted due to: "+error);
    //no such blog exists message
  });
});

PORT=process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
