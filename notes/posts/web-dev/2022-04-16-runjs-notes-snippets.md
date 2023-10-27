---
layout: post
title: "RunJS notes & snippets"
tags: [Web Dev]
notfull: 1
toc: true
icon: runjs.svg
keywords: "runjs run js playground typescript js ts nodejs node js javascript snippets testing mongodb lodash"
---

[**RunJS**](https://runjs.app/) is a wonderful playground application for testing quickly JavaScript and NodeJS.

## MongoDB

👉 [MongoDB official note](https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/)

Setting up the **environement variables** first.

```js
async function initMongoDb() {
  const uri = `mongodb+srv://${process.env.IDETA_MONGO_USER}:${process.env.IDETA_MONGO_PASSWORD}@${process.env.IDETA_MONGO_HOST}`;
  console.log(uri);
  try {
    const client = await MongoClient.connect(uri, {
      useUnifiedTopology: true
    });
    return { client, db: client.db(`${process.env.IDETA_MONGO_DATABASE}`) };
  } catch (e) {
    throw e;
  }
}

async function testMongo() {
  const mongo = await initMongoDb();
  return mongo.db.collection('agents').findOne({ active: false });
}

async function main() {
  const agent = await testMongo();
  console.log(agent);
}

main();
```



## Lodash

👉 [Lodash doc](https://lodash.com/docs/).

```js
var _ = require('lodash');
// and then test with snippets on the doc
_.chunk(['a', 'b', 'c', 'd'], 2);
```

