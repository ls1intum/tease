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
docker run -p 80:4200 -d --name tease team-allocator
  
# Stop container
docker stop tease
  
# Remove container
docker rm tease
```

## Build & Deployment

[Build Project](https://bamboobruegge.in.tum.de/browse/ITEAM-ITEAM)  
[Deployment Project](https://bamboobruegge.in.tum.de/deploy/viewDeploymentProjectEnvironments.action?id=147652609)

A build will be triggered on each commit. New branches should be tracked automatically.

You can promote a build to the following environments:

* **production**: http://teams-bruegge.in.tum.de:80 (deployment only through Dora)
* **development**: http://teams-bruegge.in.tum.de:81 (main development state)
* **sandbox**: http://teams-bruegge.in.tum.de:82 (for testing / experiments)

## Code Structure (keep up to date)
* person-data-importer = Import screen* person-details = Person detail screen* person-list = Person list* team-dashboard = Dashboard with all teams* team-generation = constraints+objectives (not implemented) screen* shared: Angular 2-best practice name for the model of your app including all fundamental logic
	* constants	* helpers = useful functions	* layers (service layer pattern for structuring the logic of the app)	* business-logic-layer (BLL) = logic that is invoked by UI (does not do any low-level operations like writing data)	* data-access-layer (DAL) = logic for writing and reading data from client (invoked by business-logic-layer)	* network-layer (NL) (not implemented yet) = execute network operations (invoked by business logic layer)	* Additional infos:		* Every major model class should have its own service in eachrespective layer; e.g. TeamService in BLL, TeamAccessService in DAL,TeamNetworkService in NL		* Every class outside of the “layer” folder should alwaysexecute services in the BLL, NEVER from the DAL or NL directly


## Notes & Learnings by Malte Bucksch (some probably outdated)
### Webpack
WebpackThe deployment is so easy thanks to WebPack and how we configured it. It might happen that you need to adapt something in how files or resources get deployed, too. In that case, you should look at the webpack.config.js file. It is working with so called loaders that help to bundle different file types.https://webpack.github.io/docs/configuration.html* Something I used for bundling the resources like pictures as well into the dist folder: CopyWebpackPlugin (https://github.com/kevlened/copy-webpack-plugin)	* It basically just copies any kind of file from your project into the output folder to your code so you can use it and display it.* WebPack takes care of auto refreshing browser content when code changed	* Annoying thing: After changing the code you need to focus the browser window oncewith the mouse to invoke the rebuild and refresh

### Learnings & Resources
* CSS learning: Why a scroll bar is shown although I set height:100% to my parent element* http://stackoverflow.com/questions/485827/css-100-height-with-padding-margin	* box-sizing: border-box;* http://stackoverflow.com/questions/1762539/margin-on-child-element-moves-parent-element	* Sometimes a child element that has a margin that sticks out of the parent (when at the border). In this case, make sure you move that element further away from border with padding or remove its margin.* Change html/dom element property programmatically in Angular 2 (Don’t you dare to use JQuery! Angular 2 and JQuery do not work together)

```
constructor(public el: ElementRef, public renderer: Renderer){	el.nativeElement.style.backgroundColor = 'yellow';	// OR	renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow'); }
```
* Best way to flatmap for Typescript: [].concat(...myList);* Keyword: Spread Operator* Problem solution for: Webpack does not auto-refresh my browser content when updating code* Quit application process through Webstorm and restart it -> It is usually caused because you added a new class which was not indexed yet* Use JavaScript libraries with Typescript* Install Typings: https://github.com/typings/typings* then install the concrete typings for your lib with	* typings install debug --save	* If the lib was not found: typings install dt~NAMEOFLIB --global –save * then use “import name= require("OBJECT-OR-CLASS-NAME");” at the top of your component.	* e.g. import Papa = require("papaparse"); (library “papaparse”)	* You can then use “Papa” to invoke JavaScript functions* Error: Angular: Can't resolve all parameters for ParamDecorator: (?, ?, ?)* Solution: You probably accidentally wrote @Injectable somewhere without the parantheses "()" behind itIn case you are freaking out and just cannot make something work: Don’t panic and write me an email. Maybe I can help malte.bucksch@gmail.com
