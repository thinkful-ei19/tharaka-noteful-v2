'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');


router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


router.get('/:id', (req, res, next) => {
  const folderId = req.params.id;
  
  knex.select('id', 'name')
    .from('folders')
    .where({'folders.id': folderId})
    .then(result => {
      if (result) {
        res.json(result[0]);
      } else {
        next();
      }
    })
    .catch(next);
  
});


router.put('/:id', (req, res, next) => {
  const folderId = req.params.id;
  //   const { id, name } = req.body;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['id', 'name'];
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  /***** Never trust users - validate input *****/
  if (!updateObj.id) {
    const err = new Error('Missing `id` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex.select('id', 'name')
    .from('folders')
    .where({ id: folderId })
    .update(updateObj)
    .returning(['id', 'name'])
    .then(([results]) => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
    
});

router.post('/', (req, res, next) => {
  const { id, name } = req.body;
    
  const newItem = { id, name };
  
  knex
    .insert({
      id: id,
      name: name
    })
    .returning(['id', 'name'])
    .into('folders')
    .then(result => {
      if (result) {
        res.location(`http://${req.headers.host}/notes/${result.id}`).status(201).json(result);
      } 
    })
    .catch(next);

});


router.delete('/:id', (req, res, next) => {
  const idNum = req.params.id;
    
  
  knex
    .del()
    .from(('folders'))
    .where({id: idNum})
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports= router;