import { expect } from "chai";
import { RequestInfo, RequestInit, Response } from "node-fetch"
import memoizedNodeFetch from '../src'

function testFetch(url: RequestInfo, options?: RequestInit | undefined): Promise<Response> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({} as Response), 10);
    })
}

describe('MemoizedNodeFetch', () => {
    const fetch = memoizedNodeFetch(testFetch);

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
    it('Will return the same promise for requests with the same key and different with other', async () => {
        const promise1 = fetch('test');
        const promise2 = fetch('test');
        const promise3 = fetch('test');
        const promise4 = fetch('test_different');

        const resultsEqual = [promise1, promise2, promise3];

        for (const r of resultsEqual) {
            expect(r).to.be.equal(promise1);
        }

        expect(promise4).to.not.be.equal(promise1);
    });
    it('Deletes a promise from the cache after it resolves', async () => {
        const promise1 = fetch('test');

        await promise1;
        const promise2 = fetch('test');

        expect(promise1).to.not.be.equal(promise2);
    });
    it('Returns different keys for different options', async () => {
        const promise1 = fetch('test', { method: 'POST' });
        const promise2 = fetch('test');
        const promise3 = fetch('test', { method: 'GET', body: JSON.stringify({ test: 'test' }) });

        expect(promise1).to.not.be.equal(promise2);
        expect(promise1).to.not.be.equal(promise3);
        expect(promise2).to.not.be.equal(promise3);
    });
})