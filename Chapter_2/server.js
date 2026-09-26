//http://localhost:8383
const express = require('express');
const app = express()
const PORT = 8383;

let data = ['james']

//middleware
app.use(express.json())
//http verbs & routes(or paths)
/* methods informs the nature of request 
 and the route is a furthure subdirecotry 
 (basically we drect the request to the body of the code to 
 respond appropriately and the loaction or the routes are called end points)*/


/* type 1 endpoints webistes endpoints (thses are for the sending back html 
and they totaly come when a user enters url in a browser)*/

app.get('/', (req,res)=>{
  //this is endpoint number 1 - /
  res.send(`
    <body
    style="background:pink;
    color:blue;">
    <h1>DATA</h1>
    <p>${JSON.stringify(data)}</p>
    <a href="/dashboard">Dashboard</a>
    </body>
    `)
  
})
app.get('/dashboard',(req,res)=>{
  //this is endpoint number 2 - /dashboard
  console.log('ohh now i hit the /dashboard endpoint')
  res.send(`
    <body>
    <h1>dashboard</h1>
    <a href='/'>Home</a>
    </body>
    `)
})
//type 2 endpoints API endpoints- non visual 

app.get('/api/data', (req,res)=>{
  console.log('THis is one is for the data')
  res.send(data)
})

app.post('/api/data',(req,res)=>{
//some wants ceate a user {for example when click a sign up  button}
/*user clcicks the sign up button after entering the credentials \, and their browser is wired up tp send out a network 
to the server to handle that action*/
 const newEntry = req.body
 console.log(newEntry)
 data.push(newEntry.name)
 res.sendStatus(201)
})

app.delete('/api/data',(req,res)=>{
  data.pop()
  console.log('deleted the last entry')
  res.sendStatus(204)
})

app.listen(PORT, () => console.log('Server has started on: ' + PORT))



