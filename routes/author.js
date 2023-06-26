const router = require("express").Router();
const Author = require("../db/Author");
const imageService = require("../images/images");
const Book = require("../db/Book");

router.post(`/create`, async (req, res, next) => {
    const {name, description} = req.body;
    try {
        if (!req.files) {
            return res.status(409).json({message: 'Upload image'})
        }
        const newAuthor = await Author.create({
            image: '',
            name: name,
            description: description,
            books: []
        })
        const image = req.files.image;
        const {url} = await imageService.uploadImage(image?.tempFilePath, `author/${newAuthor?._id}/image`);
        newAuthor.image = url;

        await newAuthor.save();

        res.status(200).json({message: 'Author created success'})

    } catch (err) {
        next(err)
    }
})

router.get('/oneAuthor/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const author = await Author.findOne({_id: id});

        if (!author) {
            return res.status(400).json({message: 'Author not found'});
        }
        res.status(200).json(author)
    } catch (err) {
        next(err)
    }
})

router.patch("/oneAuthor/:id", async (req, res) => {
    const {id} = req.params;
    const {name, description} = req.body;
    try {
        const author = await Author.findOne({_id: id});
        let image = '';
        if (req.files?.image) {
            if (author?.image) {
                const {url} = await imageService.updateImage(author?.image, req?.files?.image?.tempFilePath, `author/${author?._id}/image`)
                image = url;
            } else {
                const {url} = await imageService.uploadImage(req?.files?.image?.tempFilePath, `author/${author?._id}/image`);
                image = url;
            }
        }

        const updatedAuthor = await Author.findByIdAndUpdate(
            author?._id,
            {
                name: name,
                description: description,
                image: image ? image : author?.image
            },
            {new: true}
        );
        res.status(200).json(updatedAuthor);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/all', async (req, res, next) => {
    const {title} = req.query;
    try {
        const query = {};
        const filter = [];
        if (title) {
            filter.push({
                $or: [
                    {name: {$regex: title, $options: 'i'}},
                ]
            })
            Object.assign(query, {$and: filter})
        }
        const authors = await Author
            .find(query)
            .sort({name: 'asc'})


        res.status(200).json(authors)
    } catch (err) {
        next(err)
    }
})


module.exports = router;