import { TestState } from './state';
import { TestAction } from './actionCreator';
import { Reducer } from 'redux';

export const initialTestStore: TestState = {
    lat: 0,
    lon: 0,
    state: 'unset',
}

export const testReducer: Reducer<TestState, TestAction> = (state, action) => {
    const testState = state || initialTestStore;
    switch (action.type) {
        case 'SET_GEO':
            return { ...testState, lat: action.payload.lat, lon: action.payload.lon, state: action.payload.state };
        default:
            return testState;
    }
}