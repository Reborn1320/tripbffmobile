import { StoreData } from '../../Interfaces';
import { AUTH_ADD_TOKEN } from './actions';

export function addToken(user: StoreData.UserVM) {
    return {
        type: AUTH_ADD_TOKEN, user
    }
}