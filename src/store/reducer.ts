import { GeoStoreState } from "./state";
import { Reducer } from "redux";
import { GeoAction } from "./actionCreator";

export const geoInitialState: GeoStoreState = {
    apiState: 'unset',
}

export const geoReducer: Reducer<GeoStoreState, GeoAction> = (state, action) => {
    const geoState = state || geoInitialState;
    switch (action.type) {
        case 'SET_ERROR':
            return { ...geoState, error: action.payload.error };
        case 'SET_LOCATION':
            return { ...geoState, lat: action.payload.lat, lon: action.payload.lon };
        case 'SET_GEO_API_STATE':
            return { ...geoState, apiState: action.payload.apiState };
        default:
            return geoState;
    }
}
