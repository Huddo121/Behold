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
    }).then((containers) => {
        return containers.map(c => d.getContainer(c.Id)).map(c => new Promise((resolve, reject) => {
            c.inspect({}, (err, data) => {
                resolve(data);
            });
        }));
    }).then((inspectedContainers) => {
        return Promise.all(inspectedContainers)
    });

    let volumesPromise = new Promise((resolve, reject) => {
        d.listVolumes({}, (err, data) => {
            resolve(data.Volumes);
        })
    });


    Promise.all([imagePromise, containerPromise, volumesPromise]).then((results) => {

        //Summarise and aggregate all the data we can find for each container
        let containerSummaries = results[1].map(container => {
            let containerSummary = {};
            containerSummary.Name = container.Name;

            let containerImage = results[0].filter(image => image.Id === container.Image)[0];
            if(containerImage === undefined) {
                containerSummary.ImageName = "Unknown: " + container.Image;
            } else {
                containerSummary.ImageName = containerImage.RepoTags[0];
            }

            containerSummary.Status = container.State.Status;

            return containerSummary;
        });

        res.render('index', {title: 'Behold', images: results[0], containers: results[1], volumes: results[2], containerSummaries: containerSummaries});
    });
});

module.exports = router;
