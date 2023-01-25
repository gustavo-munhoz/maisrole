import { createToken } from "../../lib/security.mjs";
import {deleteUser, loadByCredentials, loadById, signUser, updateUser} from "./repository.mjs";

export async function register(user) {
    if (!user.id) return signUser(user);
}

export async function login({username, password}) {
    const user = await loadByCredentials(username, password);
    if (user) return {
        token: createToken(user),
        ...user
    };
    return null;
}

export async function getUser(id, showPersonalData) {
    return loadById(id, showPersonalData);
}

export async function removeUser(id){
    return deleteUser(id);
}

export async function saveUser(user) {
    return updateUser(user);
}