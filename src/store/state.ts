export type GeoApiState = 'unset' | 'waiting' | 'error' | 'denied' | 'done' | 'working';

export interface GeoStoreState {
    apiState?: GeoApiState;
    lat?: number;
    lon?: number;
    error?: PositionError;
}
