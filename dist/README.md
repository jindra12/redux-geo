# Redux-geo documentation

No other dependencies needed besides redux!
This package will allow you to periodically update your redux store with user gps information.

## Setting up your store

```typescript
const reducers = geoCombineReducers({});

export const store: Store<CombinedState<{ geo: GeoStoreState }>, AnyAction> = createStore(reducers, {
    geo: geoInitialState,
});
```

## Example of use

```typescript
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
```

### Relevant information

This package may cause browsers like Firefox to repeatedly ask for user location, if the user does not give permanent access to geolocation.
The package may execute promisified geolocation action after cancelling, if such action has already been scheduled.
The package also persists user denial of api until page reload
I'm still very much a beginner, so use this with caution.

### Update timer

The wait cycle works like this:
1) Wait for geo api to respond
2) Wait for set amount of ms
3) Repeat until cycles run out

For more information, see the test project right in this repo.
