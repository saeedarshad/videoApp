const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password .');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password .');

    const token = user.generateAuthToken();

    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;