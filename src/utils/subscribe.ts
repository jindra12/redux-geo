import { Store } from "redux";
import { setGeoApiState, setLocation, setError } from "../store/actionCreator";
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
    const service = new PromisifyGeoSubscriber({ enableHighAccuracy })
    if (!service.hasLocator()) {
        store.dispatch(setGeoApiState('error'));
        return null;
    }

    const onSuccess: PositionCallback = position => {
        if (position.coords.accuracy >= accuracy && cycles !== 0) {
            store.dispatch(setLocation(position.coords.latitude, position.coords.longitude));
        }
        if (cycles !== 'infinite') {
            cycles--;
        }
        if (cycles === 0) {
            store.dispatch(setGeoApiState('done'));
            geoInterval.deactivate();
        }
    };
    const onError: PositionErrorCallback = error => {
        store.dispatch(setError(error));
        geoInterval.deactivate();
        cycles = 0;
    };

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