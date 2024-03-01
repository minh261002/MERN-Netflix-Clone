const router = require('express').Router();
const List = require('../models/List');
const verifyToken = require('../middleware/verifyToken');

//create
router.post("/", verifyToken, async(req, res) => {
    if(req.user.isAdmin){
        const newList  = new List(req.body);

        try {
            const saveList = await newList.save();
            res.status(201).json(saveList);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Không được phép");
    }
})

//delete
router.delete("/:id", verifyToken, async (req, res) => {
    if(req.user.isAdmin){
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json('Xoá danh sách thành công');
    }else{
        res.status(403).json("Không được phép");
    }
});

//update
router.put(":id/", verifyToken, async (req, res) => {
    if(req.user.isAdmin){
        try {
            const updateList = await List.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },{
                    new: true
                }
            );
            res.status(201).json(updateList);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Không được phép");
    }
});

//get
router.get("/", verifyToken, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery, genre: genreQuery}}
                ])
            }else{
                list = await List.aggregate([{$sample: {size: 10}}]);
            }
        }else{
            list = await List.aggregate([{$sample: {size: 10}}]);
        }

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;