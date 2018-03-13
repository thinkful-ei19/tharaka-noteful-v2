'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

// TEMP: Simple In-Memory Database
/* 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
*/

// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  
  knex.select('id', 'title', 'content')
    .from('notes')
    .where(function() {
      if(searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .then(result => {
  
      res.json(result);
    })
    .catch(next); 
});

/* ========== GET/READ SINGLE NOTES ========== */
// router.get('/notes/:id', (req, res, next) => {
//   const noteId = req.params.id;

/*
  notes.find(noteId)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */
// });
//works
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex.select('id', 'title', 'content')//
    .from('notes')//
    .where({'notes.id': noteId})//
    .then(result => {//
      if (result) {
        res.json(result[0]);
      } else {
        next();
      }
    })
    .catch(next);

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
// router.put('/notes/:id', (req, res, next) => {
//   const noteId = req.params.id;
//   /***** Never trust users - validate input *****/
//   const updateObj = {};
//   const updateableFields = ['title', 'content'];

//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updateObj[field] = req.body[field];
//     }
//   });

//   /***** Never trust users - validate input *****/
//   if (!updateObj.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   /*
//   notes.update(noteId, updateObj)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next();
//       }
//     })
//     .catch(err => next(err));
//   */
// });

router.put('/notes/:id', (req, res, next) => {
  //const noteId = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .update({title:'Lakers cats'})
    .where({'notes.id': '1004'})
    //   .returning(['id', 'name']) 
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
  
  /*
  notes.update(noteId, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */
});

/* ========== POST/CREATE ITEM ========== */
// router.post('/notes', (req, res, next) => {
//   const { title, content } = req.body;
  
//   const newItem = { title, content };
//   /***** Never trust users - validate input *****/
//   if (!newItem.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   /*
//   notes.create(newItem)
//     .then(item => {
//       if (item) {
//         res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
//       } 
//     })
//     .catch(err => next(err));
//   */
// });
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert({
      title: title,
      content: content
    })
    .returning(['id', 'title', 'content'])
    .into('notes')
    .then(result => {
      if (result) {
        res.location(`http://${req.headers.host}/notes/${result.id}`).status(201).json(result);
      } 
    })
    .catch(next);
  /*
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } 
    })
    .catch(err => next(err));
  */
});


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
// router.delete('/notes/:id', (req, res, next) => {
//   const id = req.params.id;
  
//   /*
//   notes.delete(id)
//     .then(count => {
//       if (count) {
//         res.status(204).end();
//       } else {
//         next();
//       }
//     })
//     .catch(err => next(err));
//   */
// });

router.delete('/notes/:id', (req, res, next) => {
  const idNum = req.params.id;
  

  knex
    .del()
    .from(('notes'))
    .where({id: idNum})
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
  /*
  notes.delete(idNum)
    r.then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */
});

module.exports = router;