const router = require("express").Router();
const Book = require("../db/Book");
const Author = require("../db/Author");
const imageService = require("../images/images");

router.post(`/create`, async (req, res, next) => {
    const {title, description, genre, authorId} = req.body;
    try {
        if (!req.files) {
            return res.status(409).json({message: 'Upload image'})
        }
        const image = req.files.image;
        const authorData = await Author.findOne({_id: authorId});

        const newBook = await Book.create({
            image: '',
            title,
            description,
            genre,
            authorName: authorData?.name,
            author: authorData?._id
        });
        const {url} = await imageService.uploadImage(image?.tempFilePath, `books/${newBook?._id}/image`);
        newBook.image = url;
        authorData.books.push(newBook?._id);

        await authorData?.save();
        await newBook?.save();

        res.status(200).json({message: 'Book post created success'})

    } catch (err) {
        next(err)
    }
})

router.patch("/oneBook/:id", async (req, res) => {
    const {id} = req.params;
    const {author, title, description, genre} = req.body;
    try {
        const book = await Book.findOne({_id: id});
        let image = '';
        if (req.files?.image) {
            if (book?.image) {
                const {url} = await imageService.updateImage(book?.image, req?.files?.image?.tempFilePath, `books/${book?._id}/image`)
                image = url;
            } else {
                const {url} = await imageService.uploadImage(req?.files?.image?.tempFilePath, `books/${book?._id}/image`);
                image = url;
            }
        }

        const updatedBook = await Book.findByIdAndUpdate(
            book?._id,
            {
                author: author,
                title: title,
                description: description,
                genre: genre,
                image: image ? image : book?.image
            },
            {new: true}
        );
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/oneBook/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book
            .findOne({_id: id})
            .populate({path: 'author', populate: {path: 'books'}});

        res.status(200).json(book)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/allByAuthor/:id', async (req, res, next) => {
    const {id} = req.params;

    try {
        const author = await Author.findOne({_id: id});

        if (!author) {
            return res.status(404).json({message: 'Author not found'})
        }
        const books = await Book.find({author: author?._id}).sort({title: 'asc'}).exec();

        res.status(200).json(books)
    } catch (err) {

    }
})

router.get("/findAll", async (req, res) => {
    const {genre, title} = req.query;
    try {
        const query = {};
        const filter = [];
        if (genre || title) {
            if (title) {
                filter.push({
                    $or: [
                        {title: {$regex: title, $options: 'i'}},
                        {description: {$regex: title, $options: 'i'}},
                        {authorName: {$regex: title, $options: 'i'}}
                    ]
                })
            }
            if (genre) {
                filter.push({
                    $or: [
                        {genre: genre},
                    ]
                })
            }
            Object.assign(query, {$and: filter});
        }
        const books = await Book
            .find(query)
            .populate({path: 'author'})
            .sort({'title': 'asc'})
            .exec();

        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;