import { store } from './store/store';
import { geoSubscribe } from 'redux-geo';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));
store.subscribe(() => {
    // tslint:disable-next-line: no-console
    console.log(store.getState());
});

let unsubscribe = geoSubscribe(store, 2000, 2, true, 0.5);

if (!unsubscribe) {
    console.error('NO GPS!');
} else {
    (async () => {
        await wait(8000);
        unsubscribe();
        unsubscribe = geoSubscribe(store, 1000, 1, false)!;
        await wait(2000);
        unsubscribe();
    })();
}
