import { expect } from 'chai';
import { RequestInfo, RequestInit, Response } from 'node-fetch';
import memoizedNodeFetch, { FetchFunctionType } from '../src';

function testFetch(url: RequestInfo, options?: RequestInit | undefined): Promise<Response> {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            switch (url) {
                case 'fail':
                    return reject(new Error('Network Unreachable'));
                default:
                    return resolve({} as Response);
            }
        }, 100)
    );
}

describe('MemoizedNodeFetch', () => {
    let fetch: FetchFunctionType;
    beforeEach(function () {
        // runs before each test in this block
        fetch = memoizedNodeFetch(testFetch);
    });

    it('Will return the same promise for all same requests', () => {
        const promise1 = fetch('test');
        const promise2 = fetch('test');
        const promise3 = fetch('test');
        const promise4 = fetch('test');

        const results = [promise2, promise3, promise4];

        for (const r of results) {
            expect(r).to.be.equal(promise1);
        }
    });

    it('Will return the same promise for requests with the same key', async () => {
        const promise1 = fetch('test');
        const promise2 = fetch('test');
        const promise3 = fetch('test');

        const resultsEqual = [promise1, promise2, promise3];

        for (const r of resultsEqual) {
            expect(r).to.be.equal(promise1);
        }
    });

    it('Will return different promises for different keys', async () => {
        const promise = fetch('test');
        const differentPromise = fetch('test_different');

        expect(promise).to.not.be.equal(differentPromise);
    });

    it('Deletes a promise from the cache after it resolves', async () => {
        const promise1 = fetch('test');

        await promise1;
        const promise2 = fetch('test');

        expect(promise1).to.not.be.equal(promise2);
    });

    it('Deletes a promise from the cache after it rejects', async () => {
        let promise1: Promise<any>, promise2: Promise<any>;
        try {
            promise1 = fetch('fail');
            await promise1;
            promise2 = fetch('fail');
        } catch {
            expect(promise1).to.not.be.equal(promise2);
        }
    });

    it('Returns different keys for different options', async () => {
        const promise1 = fetch('test', { method: 'POST' });
        const promise2 = fetch('test');
        const promise3 = fetch('test', { method: 'GET', body: JSON.stringify({ test: 'test' }) });

        expect(promise1).to.not.be.equal(promise2);
        expect(promise1).to.not.be.equal(promise3);
        expect(promise2).to.not.be.equal(promise3);
    });
});
