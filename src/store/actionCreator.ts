import { Action } from 'redux';
import { GeoStoreState, GeoApiState } from './state';
import { GeoActionTypes } from './actionTypes';

export interface GeoAction extends Action<GeoActionTypes> {
    payload: Partial<GeoStoreState>;
}

export const setLocation = (lat: number, lon: number): GeoAction => ({
    type: 'SET_LOCATION',
    payload: {
        lat, lon,
    }
});

export const setError = (error: PositionError): GeoAction => ({
    type: 'SET_ERROR',
    payload: {
        error,
    }
});

export const setGeoApiState = (apiState: GeoApiState): GeoAction => ({
    type: 'SET_GEO_API_STATE',
    payload: {
        apiState
    }
});

export const setCycles = (cycles: number): GeoAction => ({
    type: 'SET_CYCLES',
    payload: {
        cycles
    }
});

export const killGeoApi = (): GeoAction => ({
    type: 'GEO_API_KILL',
    payload: {}
});