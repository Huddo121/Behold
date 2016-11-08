require('babel-polyfill');
var express = require('express');
var router = express.Router();
var DockerClient = require('./util/DockerClient');
var Docker = require('dockerode');
var shortenId = require('./util/shortenId');

/* GET home page. */
router.get(['/', '/containers'], function (req, res, next) {

    let client = new DockerClient();

    client.ping().then((response) => {
        if(response.isSuccess) {
            let containerPromise = client.getContainers();
            let imagePromise = client.getImages();

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
            res.render('error', {message: 'Cannot connect to Docker', error: {status: response.code, 'stack': response.message}});
        }
    });
});

router.get('/containers/:containerId', function (req, res, next) {

    //validate the id
    let containerId = req.params.containerId;
    if(containerId.length !== 12) {
        res.render('error', {message: 'Unable to retrieve image details', error: {status: 'The Image Id Provided isn\'t the correct length for a Docker short id. Short ids are 12 character hexadecimal strings', stack: new Error().stack}});
        return;
    }
    //TODO: Should probably validate the id is hex

    let client = new DockerClient();

    let containerPromise = client.getContainer(containerId);

    let imagePromise = containerPromise.then((container) => {
        return client.getImage(container.Image);
    });

    let logPromise = client.getContainerLogs(containerId);

    Promise.all([containerPromise, imagePromise, logPromise]).then((results) => {
        let container = results[0];
        let image = results[1];
        let logs = results[2];

        let imageLabels = image.Config.Labels || [];
        let portKeys = Object.keys(container.NetworkSettings.Ports);
        let ports = portKeys.map(key => {
            let portName = key.substr(0, key.indexOf('/'));

            container.NetworkSettings.Ports[key] = container.NetworkSettings.Ports[key] || [];
            let hostPorts = container.NetworkSettings.Ports[key].map(p => p.HostPort);
            return {
                containerPort: portName,
                hostPorts: hostPorts
            }
        });

        let containerDetails = {
            id: shortenId(container.Id),
            name: container.Name.replace('/', ''),
            imageId: shortenId(container.Image),
            imageName: imageLabels.Name || image.RepoTags[0] || "Unknown",
            creationDate: container.Created,
            volumes: container.Mounts.map(mount => {return {source: mount.Source, destination: mount.Destination}}),
            ports: ports
        };

        res.render('containerDetails', {title: 'Test Page', containerDetails: containerDetails, logs: logs})

    }, (error) => {
        res.render('error', {message: error.message, error: {status: error.code, 'stack': error.message}});
    });

});

module.exports = router;
