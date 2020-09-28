import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

export type FetchFunctionType = (
    url: RequestInfo,
    init?: RequestInit | undefined
) => Promise<Response>;

export default function memoizedNodeFetchFactory(fetchFunction: FetchFunctionType = fetch) {
    const promiseCache: Map<string, Promise<Response>> = new Map();

    async function wrapper(key: string, promise: Promise<Response>) {
        await promise;

        promiseCache.delete(key);

        return promise;
    }

    function wrappedFetch(url: RequestInfo, options?: RequestInit) {
        // Is there a better way?
        const key = url.toString() + JSON.stringify(options);
        if (promiseCache.has(key)) {
            return promiseCache.get(key);
        }

        const promise = wrapper(key, fetchFunction(url, options));
        promiseCache.set(key, promise);

        return promise;
    }

    return wrappedFetch;
}
