# Memoized Node Fetch

A wrapper around [node-fetch](https://www.npmjs.com/package/node-fetch) (or any other fetch-like function) that returns a single promise until it resolves.

## Why?

Sometimes, you have to interface with an API that doesn't respond fast enough. Moreover, you might perform the same request multiple times. So:

1. You overload the API with the same exactly request
2. You wait a lot of more time till the API responds.

### The solution

Return the same promise for the same exactly request. This is more useful when you interface with stateless APIs where you just consume data.

## Usage

The API is a wrapper around node-fetch.

Install the module: `$ npm i memoized-node-fetch`

```typescript
import memoizedNodeFetch from 'memoized-node-fetch';

const fetch = memoizedNodeFetch();

(async () => {
    const fetch1 = fetch('https://jsonplaceholder.typicode.com/todos/1');
    const fetch2 = fetch('https://jsonplaceholder.typicode.com/todos/1');

    // This should return true because both requests return the same promise.
    console.log(fetch1 === fetch2);

    const res1 = await fetch1;
    const res2 = await fetch2;

    console.log(await res1.json());
    console.log(await res2.json());
})();
```