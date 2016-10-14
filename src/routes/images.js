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

        images.forEach((image) => {
            let imageSummary = {
                id: shortenId(image.Id),
                name: image.RepoTags[0] || "Unknown"
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

router.get('/:imageId', (req, res, next) => {

    let d = new Docker();

    //validate the id
    let imageId = req.params.imageId;
    if(imageId.length !== 12) {
        res.render('error', {message: 'Unable to retrieve image details', error: {status: 'The Image Id Provided isn\'t the correct length for a Docker short id. Short ids are 12 character hexadecimal strings', stack: new Error().stack}});
    }
    //TODO: Should probably validate the id is hex

    let imagePromise = new Promise((resolve, reject) => {
        d.getImage(imageId).inspect((err, data) => {
            if(err) {
                reject(err);
            }
            resolve(data);
        })
    });

    imagePromise.then((image) => {

        //Normalise image object
        let labels = image.Config.Labels || [];
        let volumes = image.Config.Volumes || [];
        let ports = image.Config.ExposedPorts || [];

        let imageDetails = {
            id: shortenId(image.Id),
            name: labels.Name || image.RepoTags[0] || "Unknown",
            description: labels.Description || null,
            author: image.Author,
            creationDate: image.Created,
            ports: Object.keys(ports),
            volumes: Object.keys(volumes)
        };
        res.render('imageDetails', {imageDetails: imageDetails});
    }, (error) => {
        res.render('error', {message: error.message});
    });

});

module.exports = router;
