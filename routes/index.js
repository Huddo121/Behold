var express = require('express');
var router = express.Router();
var Docker = require('dockerode');

/* GET home page. */
router.get('/', function (req, res, next) {

    let d = new Docker();

    let imagePromise = new Promise((resolve, reject) => {
        d.listImages({}, (err, data) => {
            resolve(data);
        })
    });

    imagePromise.then((results) => {
        res.render('index', {title: 'Express', images: results});
    });
});

module.exports = router;
