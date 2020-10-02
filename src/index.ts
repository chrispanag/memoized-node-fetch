import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';
import stringToHash from './hasher';

export type FetchFunctionType = (
    url: RequestInfo,
    init?: RequestInit | undefined
) => Promise<Response>;

export default function memoizedNodeFetchFactory(fetchFunction: FetchFunctionType = fetch) {
    const promiseCache: Map<number, Promise<Response>> = new Map();

    async function wrapper(key: number, promise: Promise<Response>) {
        try {
            await promise;
        } finally {
            promiseCache.delete(key);
        }
        return promise;
    }

    function wrappedFetch(url: RequestInfo, options?: RequestInit) {
        const key = stringToHash(url.toString() + JSON.stringify(options));
        if (promiseCache.has(key)) {
            return promiseCache.get(key);
        }

        const promise = wrapper(key, fetchFunction(url, options));
        promiseCache.set(key, promise);

        return promise;
    }

    return wrappedFetch;
}
