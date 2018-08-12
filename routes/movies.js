const express = require('express');
const { Movie, validate } = require('../models/movie');
const {Genre} = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(404).send('movie is not found');
    res.send(movie);
})

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invali genre. ');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: req.body.genreId,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: req.body.genreId,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {
            new: true
        });

    if (!movie) return res.status(404).send('movie is not found');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('movie is not found');

    res.send(movie);
});

module.exports = router;