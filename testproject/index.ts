import { store } from './store/store';
import { geoSubscribe } from 'redux-geo';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

let unsubscribe = store.subscribe(() => {
    // tslint:disable-next-line: no-console
    console.log(store.getState().test);
});

if (!unsubscribe) {
    console.error('NO GPS!');
} else {
    (async () => {
        wait(3000);
        unsubscribe();
        unsubscribe = geoSubscribe(store, 1000, 5, false)!;
        wait(10000);
        unsubscribe();
    })();
}
