const router = require("express").Router();
const User = require("../db/User");
const imageService = require("../images/images");

router.patch('/update/:id', async (req, res, next) => {
    try {
        const {name} = req.body;
        const {id} = req.params;

        const user = await User.findOne({_id: id});
        if (req.files?.image) {
            if (user?.image) {
                const {url} = await imageService.updateImage(user?.image, req?.files?.image?.tempFilePath, `users/${user?._id}/image`)
                user.image = url;
            } else {
                const {url} = await imageService.uploadImage(req?.files?.image?.tempFilePath, `users/${user?._id}/image`);
                user.image = url;
            }
        }

        if (name) {
            user.name = name;
        }
        await user?.save();
        res.status(200).json({user});

    } catch (err) {
        next(err)
    }
})


router.get('/all/:id', async (req, res, next) => {

    const {id} = req.params;

    try {
        const user = await User.findOne({_id: id});
        if (user?.status !== 'admin') {
            return res.status(403).json({message: 'Access denied'})
        }
        const users = await User
            .find()
            .sort({name: 'asc'})
            .exec()

        res.status(200).json(users)

    } catch (err) {
        next(err)
    }
})


module.exports = router;