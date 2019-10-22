 # Dynamic-Student-Assessment-Server Codaisseur

 ## This server has been developed for the Dynamic-Student-Assessment test applied by Codaisseur to candidates wishing to join the academy

 In order to successfully use this server, you must install the following node_modules:

 - ExpressJs
 - Sequelize 
 - Postgres (including a local postgres server - Docker Postgres, for instance)
 - Cors 
 - JSON Body-Parser

 In your terminal, run the following commands (we developed the project using 'npm'):

 `npm init -y`
 `npm i body-parser`
 `npm i express`
 `npm i sequelize`
 `npm i pg`
 `npm i cors`
 `npm i nodemon`

 To start the terminal with nodemon, use the following command:

 `nodemon index`
 
 To start the code without tracking saved changes, you can simply run:

 `node index`

 As a standard we are using port 4000 for this server.

 ## Category:

-The Category model has one attribute 'topic', being a string. It can represent a topic of Javascript as a computer language, such as: functions, objetcs, variables, loops, if statements, etc.

GET: You can send a http request to the endpoint 
'/category' to read all the topics in category, with their respective 'id'. The pagination's limit is set to 25 but it can be changed by the query itself, using request.query.limit/offset.

POST: You can send a post request to '/category', the request.body will be a 'topic'

PUT: You can send update requests to '/category/:id'.

DELETE: You can send delete requests to '/category/:id'.

## Question:

-The Question model has the following attributes: i) "content", the question in itself, it's text/string; ii) 'initialLevel', a number that represents how hard is that question.

GET: You can send an http request to the endpoint 
'/question' to read all the topics in category, with their respective 'id'. The pagination's limit is set to 25 but it can be changed by the query itself, using request.query.limit/offset. 

PUT: You can send update requests to '/question/:id'.

DELETE: You can send delete requests to '/question/:id'.

POST: You can send a post request to '/question', the request.body will be take a 'content' a 'initialLevel' number, and a categoryId, which is the category's primary key. 




