# Behold

## About
Behold is a wallboard display application for Docker containers. The goal of Behold will be to eventually allow you to quickly understand at a glance the state of your Docker runtime and the containers.

## Running Behold
### From Source
1. Clone the repo
1. `npm install`
1. `gulp serve`
1. Open http://localhost:3000 in your favourite browser

### Docker Container
1. Clone the repo
1. `npm install`
1. `gulp build`
1. `docker run -dit --name behold -v /var/run/docker.sock:/var/run/docker.sock -p 8080:80 huddo121/behold`
1. Open http://localhost:8080 in your favourite browser
