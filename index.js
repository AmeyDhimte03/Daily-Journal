require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.\r\nPhone no: 888-888-8888\r\nMail:ameydhimte@gmail.com";

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
          console.log("succesful deletion of: "+post.title);
          res.redirect("/");
        })
        .catch((err) => {
          //unsuccessful deletion popup
          console.log("Unsuccessful deleteion of: "+post.title);
          res.redirect("/");
        });
    }
  }).catch((error)=>{
    console.log(blogTitle+" named post couldn't be deleted due to: "+error);
    //no such blog exists message
  });
});

PORT=process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
