const express = require('express')
const Blog = require('./../models/blog')
const router=express.Router()
const Sequelize = require('sequelize');
const blog = require('./../models/blog');
const Op = Sequelize.Op;




router.post('/search', async(req, res) => {
  
    let searchTerm = req.body.searchTerm;
    let blog = await Blog.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('blogs/search', {blog:blog });
  
});





router.get('/home',async (req, res) => {
  const blog =await Blog.find({}).sort({_id:-1}).limit(5);
  res.render('blogs/home', { blog: blog })
});




router.get('/new',(req,res)=>
{
    res.render('blogs/new',{blog:new Blog()})
})
router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogs/edit', { blog: blog })
  })
 
router.get('/:slug',async(req,res)=>
{ 
    const blog = await Blog.findOne({slug: req.params.slug })
   if(blog==null) 
   res.redirect('/')
   res.render('blogs/show', { blog: blog })
 //res.send(req.params.id)

}) 

  
 

router.post('/', async (req, res, next) => {

    req.blog = new Blog()
    next()
  }, saveArticleAndRedirect('new'))
  
  router.put('/:id', async (req, res, next) => {
    req.blog = await Blog.findById(req.params.id)
    next()
  }, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/')
  })


function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let blog = req.blog
      blog.title = req.body.title
      blog.author=req.body.author
      blog.img=req.body.img
      blog.category=req.body.category
      blog.description = req.body.description
      
      try {
        blog = await blog.save()
        res.redirect(`/blogs/${blog.slug}`)
      } catch (e) {
        res.render(`blogs/${path}`, { blog: blog })
      }
    }
  }  

module.exports=router


