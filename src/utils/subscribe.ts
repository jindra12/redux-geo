import { Store, CombinedState } from "redux";
import { GeoStoreState } from "../store/state";
import { setGeoApiState, setLocation, setError } from "../store/actionCreator";

const geo = (store: Store<CombinedState<{ geo: GeoStoreState }>>) => store.getState().geo;

const locator: Geolocation | undefined = navigator && navigator.geolocation;

const unsubscribe = (store: Store) => () => store.dispatch(setGeoApiState('done'));

export const geoSubscribe = (
    store: Store<CombinedState<{ geo: GeoStoreState }>>,
    cycles: number,
    timeout: number,
    enableHighAccuracy: boolean = true,
    accuracy: number = 0,
): (() => void) | null => {
    if (!locator) {
        store.dispatch(setGeoApiState('error'));
        return null;
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
        const geoCurrent = geo(store);
        if (geoCurrent.apiState !== 'denied' && geoCurrent.apiState !== 'error') {
            store.dispatch(setError(error));
            store.dispatch(setGeoApiState(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'));
            cycles = 0;
        }
    };

    const geoInterval = setInterval(() => {
        const locatorUnsubscribe = locator.watchPosition(
            onSuccess,
            onError,
            { enableHighAccuracy, timeout },
        );

        locator.getCurrentPosition(
            onSuccess,
            onError,
            { enableHighAccuracy, timeout },
        )

        if (!cycles) {
            store.dispatch(setGeoApiState('done'));
            locator.clearWatch(locatorUnsubscribe);
            clearInterval(geoInterval);
        } else {
            store.dispatch(setGeoApiState('waiting'));
            cycles--;
        }
    }, timeout);

    return unsubscribe(store);
}