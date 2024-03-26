#!/usr/bin/env bun

import Bakery from 'bakery.js';

const api = new Bakery({
  port: 3200,
});

api.addSteps(
  async function hello() {
    this.response.body = 'Hello  World';
    return this.steps.next();
  },
);

export default api;

// await fetch('http://localhost:3200')
//   .then((res) => {
//     console.debug(res);
//     return res.text();
//   }).then((res) => {
//     if (res)console.debug(`fetch: ${res}`);
//   });
