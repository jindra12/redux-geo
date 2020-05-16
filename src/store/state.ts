export type GeoApiState = 'unset' | 'waiting' | 'error' | 'denied' | 'done' | 'working';

export interface GeoStoreState {
    apiState?: GeoApiState;
    cycles?: number;
    lat?: number;
    lon?: number;
    error?: PositionError;
}
