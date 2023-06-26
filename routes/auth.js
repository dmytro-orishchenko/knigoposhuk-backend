const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../db/User");


router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const userExist = await User.findOne({email: email});
        if (userExist) {
            return res.status(400).json({message: 'User is exist'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPass,
        });

        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({message: "Wrong credentials!"});
        }

        const validated = await bcrypt.compare(req.body.password, user?.password);
        if (!validated) {
            return res.status(400).json({message: "Wrong credentials!"});
        }

        res.status(200).json({
            user: {
                _id: user?._id,
                status: user?.status,
                name: user?.name,
                image: user?.image,
                email: user?.email
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;