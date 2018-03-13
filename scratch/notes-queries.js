'use strict';

// const express = require('express');

const knex = require('../knex');

knex.select(1).then(res => console.log(res));





knex.select('id', 'title', 'content')
  .from('notes')
  .where('title', 'like', '%cats%')
  .then(result => console.log(result));


knex.select('id', 'title', 'content')
  .from('notes')
  .where({'notes.id': '1004'})
  .then(result => console.log(result));


knex('notes')
  .update({title:'Lakers cats'})
  .where({'notes.id': '1004'})
//   .returning(['id', 'name']) 
  .then(results => console.log(JSON.stringify(results, null, 2)));


knex.select('id', 'title', 'content')
  .from('notes')
  .where({'notes.id': '1004'})
  .then(result => console.log(result));


knex
  .insert({
    title: 'Vegan cats',
    content: 'not found. not found. data. data.'
  })
  .returning(['id', 'title', 'content'])
  .into('notes')
  .then(result => console.log(result));

knex
  .del()
  .from(('notes'))
  .where({id: 1003})
  .then(results => console.log(JSON.stringify(results, null, 2)));



