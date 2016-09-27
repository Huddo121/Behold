var express = require('express');
var router = express.Router();
var Docker = require('dockerode');

router.get('/', function (req, res, next) {

    let d = new Docker();

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

    Promise.all([containerPromise]).then((results) => {
        let containers = results[0];
        let imageSummaries = [];

        containers.forEach((container) => {
            let imageSummary = imageSummaries.filter(summ => summ.id == container.Image);

            if(imageSummary.length === 0) {
                //Don't have a summary for this one
                let imageSummary = {
                    id: container.Image,
                    containers: [
                        container.Id
                    ]
                };

                imageSummaries.push(imageSummary);
            } else {
                //Already have a summary started for this image
                imageSummary[0].containers.push(container.Id);
            }
        });

        res.render('images', {imageSummaries: imageSummaries})
    })
});

module.exports = router;
