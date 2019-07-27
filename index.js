const express = require('express');
const db = require('./data/db')

const server = express();

server.use(express.json());

server.get('/',(request,response) => {
    response.send("Hello World from Express!!")
})


//GET ALL USERS
server.get('/api/users', (request,response)=>{
    db.find()
    .then(users => {
        response.status(200).json(users);
    })
    .catch(err =>{
        response.status(500).json({ error: "The users information could not be retrieved." })
    })
})

//GET USER BY ID
server.get('/api/users/:id', (request,response)=> {
    const {id} = request.params;
    db.findById(id)
    .then(user =>{
        if(user){
            response.status(200).json(user);
        } else {
            response.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err =>{
        response.status(500).json({ error: "The user information could not be retrieved." })
    })
})


//POST USER
server.post('/api/users', (request,response) =>{
    const {name, bio} = request.body;

    if(!name || !bio){
        response.status(400).json({errorMessage: "Please provide name and bio for the user." })
    } else {
        db.insert({name,bio})
        .then(user => {
            response.status(201).json(user)
        })
        .catch(err =>{
            response.status(500).json({ error: "There was an error while saving the user to the database" })
        });
    }
  
})

//DELETE USER
server.delete('/api/users/:id', (request, response) =>{
    const {id} = request.params;
    db.remove(id)
    .then(deleted => {
        if(deleted){
            response.status(200).json({message: 'The user was deleted'})
        } else {
            response.status(404).json({message: "The user with the specified ID does not exist."}) //404 = DNE, does not exist
        }
    })
    .catch(err => {
        response.status(500).json({ error: "The user could not be removed" });
    })
})

//UPDATE/put User
server.put('/api/users/:id',(request, response)=>{
    const {id} = request.params;
    const userInfo = request.body;
    const {name, bio} = request.body;
    console.log(userInfo, id);
    
    if(!name || !bio){
        response.status(400).json({errorMessage: "Please provide name and bio for the user." })
    } else {
        db.update(id, userInfo)
        .then(updatedUser => {
            if(updatedUser){
                response.status(200).json(updatedUser);
            } else {
                response.status(404).json({message:"The user with the specified ID does not exist."});
            }
            
        })
        .catch(err =>{
            response.status(500).json({ error: "The user information could not be modified." })
        });
    }
    
 
})

server.listen(4000,()=>{
    console.log('server listening on port 4000');
})