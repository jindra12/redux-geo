import { ReducersMapObject, combineReducers } from 'redux';
import { geoReducer } from '../store/reducer';

/**
 * Automatically add library reducer. If you want to add geo reducer on your own,
 * name that part of the store 'geo'.
 */
export const geoCombineReducers = <M extends ReducersMapObject<any, any>>(
    reducers: M
) => combineReducers({
    ...reducers,
    geo: geoReducer,
});
