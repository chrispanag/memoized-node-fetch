import { RequestInit, RequestInfo } from 'node-fetch';

export type HashFunction = (url: RequestInfo, options?: RequestInit) => number;

export default function requestToHash(url: RequestInfo, options?: RequestInit) {
    return stringToHash(url.toString() + JSON.stringify(options));
}

function stringToHash(string: string) {
    let hash = 0;

    if (string.length === 0) {
        return hash;
    }

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash;
}
