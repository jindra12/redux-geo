import { geoCombineReducers, geoInitialState, GeoStoreState, geoSubscribe, geoMiddleware } from 'redux-geo';
import { testReducer, initialTestStore } from './reducer';
import { createStore, applyMiddleware, Middleware, AnyAction } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { TestState } from './state';
import { setGps } from './actionCreator';

const reducers = geoCombineReducers({
    test: testReducer,
});

interface RealTestState {
    geo: GeoStoreState,
    test: TestState,
}

export const store = createStore(reducers, {
    test: initialTestStore,
    geo: geoInitialState,
}, applyMiddleware(thunk as ThunkMiddleware<RealTestState, AnyAction>, geoMiddleware(setGps)));

geoSubscribe(store, 2000, true, 0.5);