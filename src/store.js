import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import path from 'node:path';

export function createStore(filename) {
    let state = { carts: {}, orders: [] };
    try {
        state = JSON.parse(readFileSync(filename, 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    if (!state.carts || !Array.isArray(state.orders))
        throw new Error('Invalid QuickBite data file.');
    return {
        state,
        save(nextState) {
            mkdirSync(path.dirname(filename), { recursive: true });
            writeFileSync(filename + '.tmp', JSON.stringify(nextState, null, 2));
            renameSync(filename + '.tmp', filename);
            this.state = nextState;
        },
    };
}
