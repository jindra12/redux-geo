import { geoCombineReducers, geoInitialState, GeoStoreState, geoSubscribe } from 'redux-geo';
import { createStore, AnyAction, CombinedState, Store } from 'redux';

const reducers = geoCombineReducers({});

export const store: Store<CombinedState<{ geo: GeoStoreState }>, AnyAction> = createStore(reducers, {
    geo: geoInitialState,
});