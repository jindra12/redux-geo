import { Store } from "redux";
import { setGeoApiState, setLocation, setError } from "../store/actionCreator";

const locator: Geolocation | undefined = navigator && navigator.geolocation;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface AsyncInterval {
    (promise: Promise<void>, ms: number): Promise<void>;
    active: boolean;
    deactivate: () => void;
}

const createAsyncInterval = (): AsyncInterval => {
    const asyncInterval: AsyncInterval = async (promiseFactory, ms) => {
        while (asyncInterval.active) {
            try {
                await promiseFactory;
            } catch {
                asyncInterval.deactivate();
            }
            await wait(ms);
        }
    };
    asyncInterval.active = true;
    asyncInterval.deactivate = () => {
        asyncInterval.active = false;
    };
    return asyncInterval;
}

const promisifyGeoSubscribe = (
    loc: Geolocation, options: PositionOptions
) => new Promise<Position>((resolve, reject) => {
    loc.watchPosition(resolve, reject, options);
});

export const geoSubscribe = (
    store: Store,
    waitMs: number,
    cycles: number | 'infinite' = 'infinite',
    enableHighAccuracy: boolean = true,
    accuracy: number = 0,
): (() => void) | null => {
    if (!locator) {
        store.dispatch(setGeoApiState('error'));
        return null;
    }

    const onSuccess: PositionCallback = position => {
        if (position.coords.accuracy >= accuracy && cycles !== 0) {
            store.dispatch(setLocation(position.coords.latitude, position.coords.longitude));
        }
        if (cycles === 0) {
            store.dispatch(setGeoApiState('done'));
            geoInterval.deactivate();
        }
        if (cycles !== 'infinite') {
            cycles--;
        }
    };
    const onError: PositionErrorCallback = error => {
        store.dispatch(setError(error));
        store.dispatch(setGeoApiState(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'));
        cycles = 0;
    };

    const geoInterval = createAsyncInterval();

    geoInterval(
        promisifyGeoSubscribe(locator, { enableHighAccuracy })
            .then(onSuccess)
            .catch(onError),
        waitMs,
    );

    store.dispatch(setGeoApiState('working'));

    return () => {
        store.dispatch(setGeoApiState('done'));
        geoInterval.deactivate();
    }
}