const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const routeGuard = require('../middleware/routeGuard');
const adminRouteGuard = require('../middleware/adminRouteGuard');
const {Genre , validate} = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id',validateObjectId ,async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) res.status(404).send('genre is not found');
    res.send(genre);
})

router.post('/',routeGuard ,async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) return res.status(404).send('genre is not found');

    res.send(genre);
});

router.delete('/:id',[routeGuard,adminRouteGuard], async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('genre is not found');

    res.send(genre);
});

module.exports = router;