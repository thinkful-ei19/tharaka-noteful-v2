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
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;
  
  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folderId', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
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
router.get('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const folderId = req.params.folderId;
 

  // knex.select('id', 'title', 'content')
  //   .from('notes')
  //   .where({'notes.id': noteId})
  //   .then(result => {
  //     if (result) {
  //       res.json(result[0]);
  //     } else {
  //       next();
  //     }
  //   })
  //   .catch(next);

  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .where({'notes.id': noteId})
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folderId', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));

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

router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
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

  knex.select('id, title', 'content')
    .from('notes')
    .where({id: noteId})
    .update(updateObj)
    .returning(['id', 'title', 'content'])
    .then(([results])=> {
      if(results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  // .update({title: title, content: content})
  // .where({id: noteId})
  // //   .returning(['id', 'name']) 
  // .then(([result]) => {
  //   if (result) {
  //     res.json(result);
  //   } else {
  //     next();
  //   }
  // })
  // .catch(next);
  
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


// router.put('/', (req, res, next) => {
//   const { title, content, folder_id } = req.body; // Add `folder_id`
  
//   /*
//   REMOVED FOR BREVITY
//   */
//   const updateItem = {
//     title: title,
//     content: content,
//     folder_id: folder_id  // Add `folder_id`
//   };

//   let noteId;

//   // Insert new note, instead of returning all the fields, just return the new `id`
//   knex.insert(updateItem)
//     .into('notes')
//     .returning('id')
//     .then(([id]) => {
//       noteId = id;
//       // Using the new id, select the new note and the folder
//       return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
//         .from('notes')
//         .leftJoin('folders', 'notes.folder_id', 'folders.id')
//         .where('notes.id', noteId);
//     })
//     .then(([result]) => {
//       res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
//     })
//     .catch(err => next(err));
// });

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
// router.post('/', (req, res, next) => {
//   const { title, content } = req.body;
  
//   const newItem = { title, content };
//   /***** Never trust users - validate input *****/
//   if (!newItem.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }

//   knex
//     .insert({
//       title: title,
//       content: content
//     })
//     .returning(['id', 'title', 'content'])
//     .into('notes')
//     .then(result => {
//       if (result) {
//         res.location(`http://${req.headers.host}/notes/${result.id}`).status(201).json(result);
//       } 
//     })
//     .catch(next);
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

router.post('/', (req, res, next) => {
  const { title, content, folder_id } = req.body; // Add `folder_id`
  /*
  REMOVED FOR BREVITY
  */
  const newItem = {
    title: title,
    content: content,
    folder_id: folder_id  // Add `folder_id`
  };

  let noteId;

  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
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

router.delete('/:id', (req, res, next) => {
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