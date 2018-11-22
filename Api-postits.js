const express = require('express');
const postits = require('./postits.js')
const Joi = require('joi');
const app = express();

app.use(express.json());

app.get('/api/postits', (req, res) => res.send(postits));

app.post('/api/postits', (req, res) =>{
    const id = Math.max(...postits.map(postit => postit.id)) + 1;
    const newPostit = {
        id,
        titulo: req.body.titulo,
        descricao: req.body.descricao
    };
    const schema = {
        titulo: Joi.string().min(5).required(),
        descricao: Joi.string().min(5).required()
    }
    const validation = Joi.validate(req.body, schema);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    } 
    postits.push(newPostit);
    res.send(newPostit);
})

app.put('/api/postits/:id', (req, res) => {
    const updatePostit = postits.find(postit => postit.id === parseInt(req.params.id));
    const schema = {
        titulo: Joi.string().min(5).required(),
        descricao: Joi.string().min(5).required()
    }
    const validation = Joi.validate(req.body, schema);
    if(!updatePostit) {
        return res.status(404).send('Não encontramos esse postit :(');
    }
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    } 
    updatePostit.titulo = req.body.titulo;
    updatePostit.descricao = req.body.descricao;
    
    res.send(updatePostit);
    
})
app.delete('/api/postits/:id', (req, res) => {
    const deletePostit = postits.find(postit => postit.id === parseInt(req.params.id));
    const index = postits.indexOf(deletePostit);
        if(!deletePostit) {
            return res.status(404).send('Não encontramos esse post:(');
        }
    postits.splice(index, 1);
    res.send(deletePostit);
    
       

        
})

app.listen(3000, ()=> console.log('aplicacao inicializada'));