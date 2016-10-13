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
                    containerSummary.id = container.Id;
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
    console.log('containers with id called');
});

module.exports = router;
