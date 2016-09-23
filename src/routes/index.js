var express = require('express');
var router = express.Router();
var Docker = require('dockerode');

/* GET home page. */
router.get('/', function (req, res, next) {

    let d = new Docker();

    let dockerUpPromise = new Promise((resolve, reject) => {
        d.ping((err, data) => {
            console.log('error', err, 'data', data);
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

            //Collect data from Volumes
            let volumesPromise = new Promise((resolve, reject) => {
                d.listVolumes({}, (err, data) => {
                    resolve(data.Volumes);
                })
            });

            Promise.all([imagePromise, containerPromise, volumesPromise]).then((results) => {

                //Summarise and aggregate all the data we can find for each container
                let containerSummaries = results[1].map(container => {
                    let containerSummary = {};
                    containerSummary.id = container.Id;
                    containerSummary.name = container.Name;

                    let containerImage = results[0].filter(image => image.Id === container.Image)[0];
                    if(containerImage === undefined) {
                        containerSummary.imageName = "Unknown: " + container.Image;
                    } else {
                        containerSummary.imageName = containerImage.RepoTags[0];
                    }

                    containerSummary.status = container.State.Status;

                    return containerSummary;
                });

                res.render('index', {title: 'Behold', images: results[0], containers: results[1], volumes: results[2], containerSummaries: containerSummaries});
            });
        } else {
            // Docker is unable to be pinged
            res.render('error', {message: 'Cannot connect to Docker', error: {status: pingResponse.code, 'stack': pingResponse.message}});
        }
    });
});

module.exports = router;
