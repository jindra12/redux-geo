import { Store } from "redux";
import { setGeoApiState, setLocation, setError } from "../store/actionCreator";
import { debounce } from "lodash";
import { PromisifyGeoSubscriber } from "./promisifyGeoSubscriber";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface AsyncInterval {
    (promise: () => Promise<void>, ms: number): Promise<void>;
    active: boolean;
    deactivate: () => void;
}

const createAsyncInterval = (): AsyncInterval => {
    const asyncInterval: AsyncInterval = async (promise, ms) => {
        while (asyncInterval.active) {
            try {
                await promise();
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

export const geoSubscribe = (
    store: Store,
    waitMs: number,
    cycles: number | 'infinite' = 'infinite',
    enableHighAccuracy: boolean = true,
    accuracy: number = 0,
): (() => void) | null => {
    const service = new PromisifyGeoSubscriber({ enableHighAccuracy, timeout: waitMs })
    if (!service.hasLocator()) {
        store.dispatch(setGeoApiState('error'));
        return null;
    }

    const onSuccess: PositionCallback = debounce(position => {
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
    }, waitMs > 10 ? waitMs - 10 : 0);
    const onError: PositionErrorCallback = debounce(error => {
        store.dispatch(setError(error));
        store.dispatch(setGeoApiState(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'));
        cycles = 0;
    }, waitMs > 10 ? waitMs - 10 : 0);

    const geoInterval = createAsyncInterval();

    geoInterval(
        () => service.subscribe()
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