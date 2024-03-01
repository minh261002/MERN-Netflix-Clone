const router = require('express').Router();
const Movie = require('../models/Movie');
const verifyToken = require('../middleware/verifyToken');
const { route } = require('./movie');

//create
router.post("/", verifyToken , async (req, res) => {
    if(req.user.isAdmin){
        const newMovie = new Movie(req.body);

        try {
            const saveMovie = await newMovie.save();
            res.status(201).json(saveMovie);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Không được phép");
    }
});

//update 
router.put("/:id", verifyToken , async (req, res) => {
    if(req.user.isAdmin){
        try {
            const updateMovie = await Movie.findByIdAndUpdate(
                req.params.id, 
                {
                    $set: req.body
                },{
                    new: true
                }
            );

            res.status(200).json(updateMovie);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Không được phép");
    }
})

//delete
router.delete("/:id" ,verifyToken, async (req, res) => {
    if(req.user.isAdmin){
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Đã xoá phim này")
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Không được phép");
    }
});

//get all
router.get("/", verifyToken , async (req, res) => {
    if(req.user.isAdmin){
        try {
            const movies = await Movie.find();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Không được phép");
    }
});

//get by id
router.get("/find/:id", verifyToken , async (req, res)=> {
    if(req.user.isAdmin){
        try {
            const movie = await Movie.findById(req.params.id);
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('Không được phép');
    }
});


//get random
router.get("/random", verifyToken, async (req, res) => {
    const type = req.query.type;
    let movie;

    try{
        if(type === "series"){
            movie = await Movie.aggregate([
                {
                    $match: {isSeries: true}
                },
                {
                    $sample: {size: 1}
                }
            ]);
        }else{
            movie = await Movie.aggregate([
                {
                    $match: {isSeries: false}
                },
                {
                    $sample: {size: 1}
                }
            ]);
        }

        if(movie.length > 0) {
            res.status(200).json(movie[0]);
        } else {
            res.status(404).json("Không tìm thấy phim phù hợp");
        }
    } catch(error) {
        res.status(500).json(error);
    }
});


module.exports = router;