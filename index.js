#!/usr/bin/env bun
/* eslint-disable no-tabs */

/* eslint-disable no-restricted-syntax */

import { Suite } from 'benchmark';
import { writeFile } from 'fs/promises';

const urls = {
  bakery: 'http://localhost:3200',
  koa: 'http://localhost:3300',
  fastify: 'http://localhost:3400/',
  elysia: 'http://localhost:3500/',
};

// 执行单个请求并检查状态码
async function makeRequest(url) {
  const response = await fetch(url);
  if (response.status === 200) {
    return true;
  }
  return false;
}

// 执行并行请求测试
async function concurrentRequests(url, count = 40) {
  const requests = Array.from({ length: count }, () => makeRequest(url));
  const results = await Promise.all(requests);
  return results.filter((result) => result).length;
}

// 创建一个Benchmark套件
const suite = new Suite();

// 结果对象
const results = {
  bakery: { single: 0, concurrent: 0 },
  koa: { single: 0, concurrent: 0 },
  fastify: { single: 0, concurrent: 0 },
  elysia: { single: 0, concurrent: 0 },
};

// 测试每个服务的单个请求性能
for (const [name, url] of Object.entries(urls)) {
  suite.add(`${name} single request`, {
    defer: true,
    fn: async (deferred) => {
      await makeRequest(url);
      deferred.resolve();
    },
  });
}
for (const [name, url] of Object.entries(urls)) {
  suite.add(`${name} concurrent request`, {
    defer: true,
    fn: async (deferred) => {
      await concurrentRequests(url);
      deferred.resolve();
    },
  });
}

suite
  .on('complete', async () => {
    const currentTime = new Date().toISOString();
    const csvLine = `${currentTime},${results.bakery.single},${results.bakery.concurrent},${results.koa.single},${results.koa.concurrent},${results.fastify.single},${results.fastify.concurrent},${results.elysia.single},${results.elysia.concurrent}\n`;
    await writeFile('performance_results.csv', csvLine, { flag: 'a' });
  })
  .on('cycle', (event) => {
    const [name, type] = event.target.name.split(' ');
    const ops = event.target.hz; // 操作/秒
    results[name][type] = Math.round(ops * 100) / 100;
    console.log(String(event.target));
  })
  .run({ async: true });
