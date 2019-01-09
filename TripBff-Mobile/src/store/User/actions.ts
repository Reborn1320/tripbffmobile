import { StoreData } from '../../Interfaces';

export const AUTH_ADD_TOKEN = "AUTH_ADD_TOKEN"

export function addToken(user: StoreData.UserVM) {
    return {
        type: AUTH_ADD_TOKEN, user
    }
}