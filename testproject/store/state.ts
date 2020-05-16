import { GeoApiState } from 'redux-geo';

export interface TestState {
    lat?: number;
    lon?: number;
    state?: GeoApiState;
}