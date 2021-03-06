const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const routeGuard = require('../middleware/routeGuard');
const { User, validate } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name').select('name');
    res.send(users);
});

router.get('/me',routeGuard, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).send('user is not found');
    res.send(user);
})

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({email : req.body.email });
    if(user) return res.status(400).send('User already exists .');

    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password  = await bcrypt.hash(user.password , salt);

    await user.save();
    res.send(_.pick(user,['name','email']));
});

module.exports = router;