# Memoized Node Fetch
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm](https://img.shields.io/npm/v/memoized-node-fetch)](https://www.npmjs.com/package/memoized-node-fetch) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/chrispanag/memoized-node-fetch/Node%20CI) ![npm](https://img.shields.io/npm/dw/memoized-node-fetch)

A wrapper around [node-fetch](https://www.npmjs.com/package/node-fetch) (or any other fetch-like function) that returns a single promise until it resolves.

## Why?

Sometimes, you have to interface with an API that doesn't respond fast enough. Moreover, you might perform the same request multiple times. So:

* You overload the API with the same exact requests.
* You wait for additional time during the API response.

### The solution

Return the same promise for the same exact requests **until they resolve**. This is more useful when you interface with stateless APIs, where you just consume data. 

#### Scenario

User (1) makes a request to the backend. The backend then performs a request to a third-party API and then before it resolves, user (2) makes another request to the backend. The backend then needs to perform the same request, as before, to the third-party API. With this package, instead of performing a new request, you can access and use the same promise for user's (1) request and have user (2) wait for the same request's resolution. This should shorten the wait time for user (2).

## Usage

This API is a wrapper around node-fetch.

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

#### Is this a data cache?

No. This package only caches the promise until it resolves. After the promise resolves, it is removed from the cache, along with the data returned.

#### How do you know that two requests are the same?

The parameters of the two fetch functions are compared (the url and the RequestOptions), the specific key used for comparing the requests is: 

`const key = stringToHash(url.toString() + JSON.stringify(options));`

The parameters of the request are hashed and stored on a map.

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

#### Is this a react-query/swr equivalent? 

No. For most cases, you shouldn't use this library instead of react-query or swr. Rather you could use it in tandem with those libraries by substituting the fetcher function with this. Those libraries, although they implement caching, they don't implement it while the fetch is loading (so if you perform the request two times, you'll get two different promises).

#### Why you didn't use a debounce function?

1. I don't want to do request deduplication per-se but rather I want to return the same promise for each instance of the request. That won't work easily with the debounce function.
2. The debounce implementation of lodash/underscore, waits for a specific preset time before running the request. If my promise takes longer to resolve, then I wouldn't reap the benefits of it. In my case, I wait for the promise to resolve before making a duplicate request.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Nikpolik"><img src="https://avatars0.githubusercontent.com/u/9081019?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nikos Polykandriotis</b></sub></a><br /><a href="https://github.com/chrispanag/memoized-node-fetch/commits?author=Nikpolik" title="Code">💻</a></td>
    <td align="center"><a href="http://stackexchange.com/users/1677570/ferrybig"><img src="https://avatars2.githubusercontent.com/u/1576684?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fernando van Loenhout</b></sub></a><br /><a href="https://github.com/chrispanag/memoized-node-fetch/commits?author=ferrybig" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Bonjur"><img src="https://avatars3.githubusercontent.com/u/12468730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bonjour Comosava</b></sub></a><br /><a href="https://github.com/chrispanag/memoized-node-fetch/commits?author=Bonjur" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!