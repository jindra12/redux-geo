import { GeoStoreState } from "./state";
import { GeoAction, setGeoApiState, killGeoApi } from "./actionCreator";
import { AnyAction, Middleware, MiddlewareAPI, Dispatch, CombinedState } from "redux";

const setCycle = (geo: GeoStoreState, next: Dispatch<AnyAction>, callback?: (url: GeoStoreState) => AnyAction) => {
    if (callback) {
        next(callback(geo));
    }
}

export const geoMiddleware = (
    callback?: (url: GeoStoreState) => AnyAction,
): Middleware => (
    api: MiddlewareAPI<Dispatch, CombinedState<{ geo: GeoStoreState }>>
) => (next: Dispatch<AnyAction>) => (action: GeoAction) => {
    const geo = api.getState().geo;
    switch (action.type) {
        case 'SET_LOCATION':
            setCycle(geo, next, callback);
            break;
        case 'SET_ERROR':
            if (action.payload.error?.code === action.payload.error?.PERMISSION_DENIED) {
                next(setGeoApiState('denied'));
                next(killGeoApi());
            } else {
                next(setGeoApiState('error'));
                next(killGeoApi());
            }
            setCycle(geo, next, callback);
            break;
    }
    next(action);
};