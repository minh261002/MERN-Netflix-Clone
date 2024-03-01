const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

//delete
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.id === req.params.id || req.user.isAdmin) {
           await User.findByIdAndDelete(req.params.id);
           res.status(200).json('Đã xoá tài khoản');
        } else {
            res.status(403).json('Bạn không có quyền xoá tài khoản');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//update
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            if (req.body.password) {
                req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
            }

            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            
            res.status(200).json(updateUser);
        } else {
            res.status(403).json('Bạn không có quyền cập nhật thông tin ');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//get by id
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...info} = user._doc;

        res.status(200).json(info);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get all
router.get("/", verifyToken , async (req, res) => {
    const query = req.query.new;

    if(req.user.isAdmin){
        const users = query ? await User.find().limit(10) : await User.find();
        res.status(200).json(users);
    }else{
        res.status(401).json('Không được phép');
    }
});

//user stats
router.get("/stats", async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);

    const monthsArray = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
    ];
    
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            },{
                $group: {
                    _id: "$month",
                    total: {$sum:1}
                }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;


