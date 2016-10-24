require('babel-polyfill');

const Docker = require('dockerode');

const DockerClient = function() {
    this.runtime = new Docker();
};

/**
 * Attempt to connect to the Docker runtime.
 * @returns {Promise} A Promise for the response from the Docker runtime. In the event that the Docker
 * runtime cannot be reached an error response will be resolved, rather than rejected, as this
 * is considered a 'successful response'.
 */
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

/**
 * Get an array of all running containers in the Docker runtime
 * @returns {Promise} A Promise for an array of running containers available to the Docker runtime
 */
//TODO: Have this return stopped containers too.
DockerClient.prototype.getContainers = async function() {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
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

/**
 * Return the details for a container with the specified id.
 * @param containerId The hash id of the container, as seen when running `docker ps -a`
 * @returns {Promise} A Promise for the container's details
 */
DockerClient.prototype.getContainer = async function(containerId) {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
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

/**
 * Get an array of all images available to the Docker runtime
 * @returns {*} A Promise for an array of images available to the Docker runtime
 */
DockerClient.prototype.getImages = async function() {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
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

/**
 * Return the details for an image with the specified id.
 * @param imageId The hash id of the image, as seen when running `docker images`
 * @returns {Promise} A Promise for the image's details
 */
DockerClient.prototype.getImage = async function(imageId) {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
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

DockerClient.prototype.getContainerLogs = async function(containerId) {

    let pingResponse = await this.ping();
    if(!pingResponse.isSuccess) {
        return Promise.reject(pingResponse);
    }

    //TODO: Switch to using a stream and update logs on client in real-time
    let params = {
        stdout: true,
        stderr: true,
        timestamps: false
    };

    let modem = this.runtime.modem;
    let optsf = {
        path: '/containers/' + containerId + '/logs?',
        method: 'GET',
        isStream: false,
        auth: undefined,
        statusCodes: {
            200: true,
            500: 'server error'
        },
        options: params
    };

    return new Promise((resolve, reject) => {
        modem.dial(optsf, function(err, data) {
            if(err) { reject(err); }
            resolve(data);
        });
    });

};

module.exports = DockerClient;
