import { StoreData } from '../Interfaces';

export const AUTH_ADD_TOKEN = "AUTH_ADD_TOKEN";
export const UPDATE_LOCALE = "UPDATE_LOCALE";

export function addToken(user: StoreData.UserVM) {
    return {
        type: AUTH_ADD_TOKEN, user
    }
}

export function updateLocate(locale: string) {
    return {
        type: UPDATE_LOCALE, locale
    }
}