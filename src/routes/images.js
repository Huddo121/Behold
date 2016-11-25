var express = require('express');
var router = express.Router();
let DockerClient = require('./util/DockerClient');
var shortenId = require('./util/shortenId');

router.get('/', function (req, res, next) {
    let client = new DockerClient();

    let imagePromise = client.getImages();
    let containerPromise = client.getContainers();

    Promise.all([containerPromise, imagePromise]).then((results) => {
        let containers = results[0];
        let images = results[1];
        let imageSummaries = [];

        images.forEach((image) => {
            let labels = image.Config.Labels || [];
            let imageSummary = {
                id: shortenId(image.Id),
                name: labels.Name || image.RepoTags[0] || "Unknown: " + shortenId(image.Id),
            };

            imageSummary.containers  = containers.filter(c => c.Image === image.Id).map(c => {return {
                id: shortenId(c.Id),
                name: c.Name.replace('/', '')
            }});

            imageSummaries.push(imageSummary);
        });

        imageSummaries.sort((summ1, summ2) => {
            if(summ1.containers.length > summ2.containers.length) {
                return -1;
            }
            if(summ1.containers.length < summ2.containers.length) {
                return 1;
            }
            return 0;
        });

        res.render('images', {imageSummaries: imageSummaries})
    }, (error) => {
        res.render('error', {message: error.message, error: {status: error.code, 'stack': error.message}});
    })
});

router.get('/:imageId', (req, res, next) => {

    //validate the id
    let imageId = req.params.imageId;
    if(imageId.length !== 12) {
        res.render('error', {message: 'Unable to retrieve image details', error: {status: 'The Image Id Provided isn\'t the correct length for a Docker short id. Short ids are 12 character hexadecimal strings', stack: new Error().stack}});
    }
    //TODO: Should probably validate the id is hex

    let client = new DockerClient();

    let imagePromise = client.getImage(imageId);

    imagePromise.then((image) => {

        //Normalise image object
        let labels = image.Config.Labels || [];
        let volumes = image.Config.Volumes || [];
        let ports = image.Config.ExposedPorts || [];

        let imageDetails = {
            id: shortenId(image.Id),
            name: labels.Name || image.RepoTags[0] || "Unknown: " + shortenId(image.Id),
            description: labels.Description || null,
            author: image.Author,
            creationDate: image.Created,
            ports: Object.keys(ports),
            volumes: Object.keys(volumes)
        };
        res.render('imageDetails', {imageDetails: imageDetails});
    }, (error) => {
        res.render('error', {message: error.message, error: {status: error.code, 'stack': error.message}});
    });

});

module.exports = router;
