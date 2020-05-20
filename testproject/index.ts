import { store } from './store/store';
import { geoSubscribe } from 'redux-geo';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));
store.subscribe(() => {
    // tslint:disable-next-line: no-console
    console.log(store.getState());
});

let unsubscribe = geoSubscribe(store, 1000, 5, true, 0.5);

if (!unsubscribe) {
    console.error('NO GPS!');
} else {
    (async () => {
        await wait(20000);
        unsubscribe();
        unsubscribe = geoSubscribe(store, 1000, 5, false)!;
        await wait(10000);
        unsubscribe();
    })();
}
