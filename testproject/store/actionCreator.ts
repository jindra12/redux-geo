import { Action } from 'redux';
import { TestActionTypes } from './actionTypes';
import { TestState } from './state';
import { GeoStoreState } from 'redux-geo';

export interface TestAction extends Action<TestActionTypes> {
    payload: Partial<TestState>;
}

export const setGps = (state: GeoStoreState): TestAction => ({
    type: 'SET_GEO',
    payload: {
        lat: state.lat,
        lon: state.lon,
        state: state.apiState,
    }
})