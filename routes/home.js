const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index',{title:'Video App',message:'Video Rental App'});
});

module.exports = router;