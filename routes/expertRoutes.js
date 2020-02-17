const express = require('express');

const { User } = require('../models');

const router = express.Router();

router.get('/getexperts', async (req, res) => {
    const experts = await User.find({})
    res.json(experts);
})

module.exports = router;