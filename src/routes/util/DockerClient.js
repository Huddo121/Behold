require('babel-polyfill');

const Docker = require('dockerode');

const DockerClient = function() {
    this.runtime = new Docker();
};

DockerClient.prototype.ping = async function() {
    return new Promise((resolve, reject) => {
        this.runtime.ping((err, data) => {
            let pingResponse = {
                isSuccess: err ? false : true,
                code: 'OK',
                message: 'OK'
            };

            //Add any error messages/responses
            if(err) {
                pingResponse.message = 'Cannot connect to Docker',
                pingResponse.code = err.code;
                pingResponse.stack = err.stack;
            }

            resolve(pingResponse);
        });
    });
};

DockerClient.prototype.getContainers = async function() {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
        console.log('couldn\'t connect to docker in getContainers');
        return Promise.reject(pingResponse);
    }

    return new Promise((resolve, reject) => {
        this.runtime.listContainers({}, (err, data) => {
            resolve(data);
        })
    }).then((containers) => {
        return containers.map(c => this.runtime.getContainer(c.Id)).map(c => new Promise((resolve, reject) => {
            c.inspect({}, (err, data) => {
                resolve(data);
            });
        }));
    }).then((inspectedContainers) => {
        return Promise.all(inspectedContainers)
    });
};

DockerClient.prototype.getContainer = async function(containerId) {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
        console.log('couldn\'t connect to docker in getContainer');
        return Promise.reject(pingResponse);
    }

    return new Promise((resolve, reject) => {
        this.runtime.getContainer(containerId).inspect((err, data) => {
            if(err) {
                reject(err);
            }
            resolve(data);
        })
    });
};

DockerClient.prototype.getImages = async function() {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
        console.log('couldn\'t connect to docker in getImages');
        return Promise.reject(pingResponse);
    }

    return new Promise((resolve, reject) => {
        this.runtime.listImages({}, (err, data) => {
            resolve(data);
        })
    }).then((images) => {
        return images.map(i => this.runtime.getImage(i.Id)).map(i => new Promise((resolve, reject) => {
            i.inspect((err, data) => {
                resolve(data);
            })
        }));
    }).then((inspectedImages) => {
        return Promise.all(inspectedImages);
    });
};

DockerClient.prototype.getImage = async function(imageId) {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
        console.log('couldn\'t connect to docker in getImage');
        return Promise.reject(pingResponse);
    }

    return new Promise((resolve, reject) => {
        this.runtime.getImage(imageId).inspect((err, data) => {
            if(err) {
                reject(err);
            }
            resolve(data);
        })
    });
};

module.exports = DockerClient;
