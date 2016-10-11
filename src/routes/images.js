var express = require('express');
var router = express.Router();
var Docker = require('dockerode');
var shortenId = require('./util/shortenId');

router.get('/', function (req, res, next) {

    let d = new Docker();

    //Get the list of images from docker
    let imagePromise = new Promise((resolve, reject) => {
        d.listImages({}, (err, data) => {
            resolve(data);
        })
    }).then((images) => {
        return images.map(i => d.getImage(i.Id)).map(i => new Promise((resolve, reject) => {
            i.inspect((err, data) => {
                resolve(data);
            })
        }));
    }).then((inspectedImages) => {
        return Promise.all(inspectedImages);
    });

    let containerPromise = new Promise((resolve, reject) => {
        d.listContainers({}, (err, data) => {
            resolve(data);
        })
    }).then((containers) => {
        return containers.map(c => d.getContainer(c.Id)).map(c => new Promise((resolve, reject) => {
            c.inspect({}, (err, data) => {
                resolve(data);
            });
        }));
    }).then((inspectedContainers) => {
        return Promise.all(inspectedContainers)
    });

    Promise.all([containerPromise, imagePromise]).then((results) => {
        let containers = results[0];
        let images = results[1];
        let imageSummaries = [];

        console.log('images', images);
        console.log('containers',containers);

        images.forEach((image) => {
            let imageSummary = {
                id: shortenId(image.Id),
                name: image.RepoTags[0]
            };

            imageSummary.containers  = containers.filter(c => c.Image === image.Id).map(c => {return {
                id: shortenId(c.Id),
                name: c.Name
            }});

            imageSummaries.push(imageSummary);
        });

        res.render('images', {imageSummaries: imageSummaries})
    })
});

module.exports = router;
