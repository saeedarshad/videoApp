const express = require('express');
const mongoose = require('mongoose');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const {Rental , validate} = require('../models/rental');
const Fawn = require('fawn');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-datOut');
    res.send(rentals);
});

router.get('/:id', async(req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) res.status(404).send('rental is not found');
    res.send(rental);
})

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invali customer. ');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invali movie. ');

    if(movie.numberInStock ===0) return res.status(400).send('Movie not in Stock ');

    let rental = new Rental({ 
        customer: {
          _id: customer._id,
          name: customer.name, 
          phone: customer.phone
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate
        }
      });
      try {
        new Fawn.Task()
        .save('rentals',rental)
        .update('movies',{ _id : movie._id} , { $inc : {numberInStock : -1}})
        .run();

        res.send(rental);
          
      } catch (error) {
          res.status(500).send('Internal Error');
      }
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!rental) return res.status(404).send('rental is not found');

    res.send(rental);
});

router.delete('/:id', async(req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(404).send('rental is not found');

    res.send(rental);
});

module.exports = router;