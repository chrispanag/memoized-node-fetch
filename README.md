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

### FAQ

#### How do you know that two requests are the same?

The parameters of the two fetch functions, are compared (the url and the RequestOptions). The specific key used for comparing the requests is: 

`const key = url.toString() + JSON.stringify(options);`

#### Can I use another fetch-like function?

Of course, you can use your own `fetch` like this:

```typescript
function myOwnFetch(url: RequestInfo, options?: RequestInit | undefined): Promise<Response> {
    /* bla bla bla */
}

const fetch = memoizedNodeFetch(myOwnFetch);

/* Use the fetch... */
```

#### Can I have multiple promise-cache instances?

Yes! Each time you run the factory function, a new promise-cache is created.
