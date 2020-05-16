import { Store, CombinedState } from "redux";
import { GeoStoreState } from "../store/state";
import { setGeoApiState, setCycles, setLocation, setError, killGeoApi } from "../store/actionCreator";

const geo = (store: Store<CombinedState<{ geo: GeoStoreState }>>) => store.getState().geo;

const locator: Geolocation | undefined = navigator && navigator.geolocation;

export const geoSubscribe = (
    store: Store<CombinedState<{ geo: GeoStoreState }>>,
    timeout: number,
    enableHighAccuracy: boolean = true,
    accuracy: number = 0,
): number => {
    if (!locator) {
        store.dispatch(setGeoApiState('error'));
        store.dispatch(killGeoApi());
        return -1;
    }
    store.dispatch(setGeoApiState('waiting'));

    const onSuccess: PositionCallback = position => {
        if (position.coords.accuracy >= accuracy) {
            const geoCurrent = geo(store);
            if (geoCurrent.apiState === 'waiting') {
                store.dispatch(setLocation(position.coords.latitude, position.coords.longitude));
                store.dispatch(setGeoApiState('working'));
            }
        }
    };
    const onError: PositionErrorCallback = error => {
        store.dispatch(setError(error));
        store.dispatch(setGeoApiState('working'));
    };

    const geoInterval = setInterval(() => {
        const geoCurrent = geo(store);

        const unsubscribe = locator.watchPosition(
            onSuccess,
            onError,
            { enableHighAccuracy, timeout },
        );

        locator.getCurrentPosition(
            onSuccess,
            onError,
            { enableHighAccuracy, timeout },
        )

        if (!geoCurrent.cycles) {
            store.dispatch(setGeoApiState('done'));
            locator.clearWatch(unsubscribe);
            clearInterval(geoInterval);
        } else {
            store.dispatch(setGeoApiState('waiting'));
            store.dispatch(setCycles(geoCurrent.cycles - 1));
        }
    }, timeout);

    return geoInterval;
}