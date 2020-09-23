import fetch, { RequestInfo, RequestInit } from 'node-fetch';

export default class MemoizedNodeFetch {
    private promiseCache: Map<string, Promise<any>> = new Map();

    private async wrapper(key: string, promise: Promise<any>) {
        await promise;

        this.promiseCache.delete(key);

        return promise;
    }

    public fetch(url: RequestInfo, options: RequestInit) {
        const key = JSON.stringify(url) + JSON.stringify(options);
        if (this.promiseCache.has(key)) {
            return this.promiseCache.get(key);
        }

        const promise = this.wrapper(key, fetch(url, options));
        this.promiseCache.set(key, promise);

        return promise;
    }
}