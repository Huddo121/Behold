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

    let containerPromise = new Promise((resolve, reject) => {
        d.listContainers({}, (err, data) => {
            resolve(data);
        })
    });

    Promise.all([imagePromise, containerPromise]).then((results) => {
        res.render('index', {title: 'Behold', images: results[0], containers: results[1]});
    });
});

module.exports = router;
