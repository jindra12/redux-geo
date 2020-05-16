import { store } from './store/store';

store.subscribe(() => {
    // tslint:disable-next-line: no-console
    console.log(store.getState().test);
});