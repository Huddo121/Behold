var express = require('express');
var router = express.Router();
var Docker = require('dockerode');
var shortenId = require('./util/shortenId');

/* GET home page. */
router.get(['/', '/containers'], function (req, res, next) {

    let d = new Docker();

    let dockerUpPromise = new Promise((resolve, reject) => {
        d.ping((err, data) => {
            let pingResponse = {
                isSuccess: err ? false : true,
                code: 'OK',
                message: 'OK'
            };

            //Add any error messages/responses
            if(err) {
                pingResponse.code = err.code;
                pingResponse.message = err.stack;
            }

            resolve(pingResponse);
        });
    });

    dockerUpPromise.then((pingResponse) => {
        if(pingResponse.isSuccess) {
            //Collect data from Containers
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

            //Collect data from Images
            let imagePromise = new Promise((resolve, reject) => {
                d.listImages({}, (err, data) => {
                    resolve(data);
                })
            });

            Promise.all([imagePromise, containerPromise]).then((results) => {

                //Summarise and aggregate all the data we can find for each container
                let containerSummaries = results[1].map(container => {
                    let containerSummary = {};
                    containerSummary.id = shortenId(container.Id);
                    containerSummary.name = container.Name.replace('/', '');
                    containerSummary.imageId = shortenId(container.Image);

                    let containerImage = results[0].filter(image => image.Id === container.Image)[0];
                    if(containerImage === undefined) {
                        containerSummary.imageName = "Unknown: " + shortenId(container.Image);
                    } else {
                        containerSummary.imageName = container.Config.Image;
                    }

                    containerSummary.status = container.State.Status;

                    return containerSummary;
                });

                res.render('containers', {title: 'Behold', images: results[0], containers: results[1], volumes: results[2], containerSummaries: containerSummaries});
            });
        } else {
            // Docker is unable to be pinged
            res.render('error', {message: 'Cannot connect to Docker', error: {status: pingResponse.code, 'stack': pingResponse.message}});
        }
    });
});

router.get('/containers/:containerId', function (req, res, next) {
    let d = new Docker();

    //validate the id
    let containerId = req.params.containerId;
    if(containerId.length !== 12) {
        res.render('error', {message: 'Unable to retrieve image details', error: {status: 'The Image Id Provided isn\'t the correct length for a Docker short id. Short ids are 12 character hexadecimal strings', stack: new Error().stack}});
        return;
    }
    //TODO: Should probably validate the id is hex

    let containerPromise = new Promise((resolve, reject) => {
        d.getContainer(containerId).inspect((err, data) => {
            if(err) {
                reject(err);
            }
            resolve(data);
        })
    });

    //Collect data from Images
    let imagePromise = containerPromise.then((container) => {
        return new Promise((resolve, reject) => {
            d.getImage(container.Image).inspect((err, data) => {
                if(err) {
                    reject(err);
                }
                resolve(data);
            })
        });
    });

    Promise.all([containerPromise, imagePromise]).then((results) => {
        let container = results[0];
        let image = results[1];
        let imageLabels = image.Config.Labels || [];
        //TODO: Make ports more accurate, currently just showing exposed ports. Need to show all local ports that map to container's exposed ports
        let ports = Object.keys(container.NetworkSettings.Ports);

        let containerDetails = {
            id: shortenId(container.Id),
            name: container.Name.replace('/', ''),
            imageId: shortenId(container.Image),
            imageName: imageLabels.Name || image.RepoTags[0] || "Unknown",
            creationDate: container.Created,
            volumes: container.Mounts.map(mount => {return {source: mount.Source, destination: mount.Destination}}),
            ports: ports
        };

        res.render('containerDetails', {title: 'Test Page', containerDetails: containerDetails})

    }, (error) => {
        res.render('error', {message: error.message});
    });

});

module.exports = router;
