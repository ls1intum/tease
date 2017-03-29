# Team Allocator
Team Allocation decision support system as used in the iPraktikum.

## Run locally
* Clone the project to your local machine
* Navigate to the project folder in terminal
* Execute the following commands:

```
npm install
sudo npm start
```

* The tool is now accessible in your browser under "localhost"
* To terminate the process, press Ctrl+C in terminal
* Tested with versions:
	* node: 6.9.1, 6.10.0
	* npm: 3.10.9

## Run in a docker container

Create your Docker image:

```
docker build -t team-allocator .
```

Run your container from the image:

```
# Run container
docker run -p 80:80 -d --name tease team-allocator
  
# Stop container
docker stop tease
  
# Remove container
docker rm tease
```

## Deployment (Malte's version - to be replaced by automatic deployment)
Log into server via ssh
```


To prevent your http-server from dying: you run it using pm2 (https://github.com/Unitech/pm2). It takes care of restarting the process if it ever crashes. Long story short:

```
```

In case the http-server or pm2 does not respond or anything, either use

```

# Code Structure
* person-data-importer = Import screen
	* constants


# Notes & Learnings by Malte Bucksch
## Webpack
Webpack

## Learnings & Resources
* CSS learning: Why a scroll bar is shown although I set height:100% to my parent element

```
constructor(public el: ElementRef, public renderer: Renderer){
```
