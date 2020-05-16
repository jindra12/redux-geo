# Redux-url-sync documentation

No other dependencies needed besides redux!
This is my first package to create, so be careful :) .

## Setting up your store

```typescript
const reducers = urlCombineReducers({
    test: testReducer,
});

export const store = createStore(reducers, {
    test: testInitialState,
    url: urlInitialState,
}, applyMiddleware(thunk as ThunkMiddleware<IRealTestState, AnyAction>, urlMiddleware(updateFromUrl)));

subscribeToUrl(store);
```

## Example with redux-thunk

```typescript
export const setUrlFirstName = (
    firstName: string
): ThunkAction<void, IRealTestState, undefined, AnyAction> => (dispatch, store) => {
    const lastName = store().test.lastName || '';
    dispatch(setUrlQuery({
        firstName,
        lastName,
    }));
    dispatch(setFirstName(firstName));
};
```

For more information, see the test project right in this repo.
