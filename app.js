const express= require('express')
const app=express()
const blogsrouter=require('./routes/blogs')
const mongoose = require('mongoose')
const Blog=require('./models/blog')
const methodOverride = require("method-override");




const uri =
  "mongodb+srv://maham27:fortyrules27@cluster0.7libf.mongodb.net/?retryWrites=true&w=majority";

//mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
  //connect to mongoDB
  
  mongoose.connect(uri,
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    });


  app.set('view engine','ejs')


  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));

  app.get("/", async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: "desc" });
    res.render("blogs/index", { blogs: blogs });
  });
app.use('/blogs',blogsrouter)
app.listen(3000)

