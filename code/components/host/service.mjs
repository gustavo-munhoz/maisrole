import {
    deleteHost, getRating,
    filterReviewsByHost,
    insertReview,
    loadByCredentials,
    loadById,
    signHost,
    updateHost
} from "./repository.mjs";
import {createToken} from "../../lib/security.mjs";

export async function register(host) {
    return signHost(host);
}

export async function login({email, password}) {
    const host = await loadByCredentials(email, password);
    if (host) return {
        token: createToken(host),
        ...host
    };
    return null;
}

export async function getHost(id) {
    return loadById(id);
}

export async function removeHost(id) {
    return deleteHost(id);
}
export async function saveReview(hostId, userId, rating, text) {
    return insertReview(hostId, userId, rating, text);
}

export async function showRating(id) {
    return getRating(id);
}

export async function saveHost(host) {
    return updateHost(host);
}

export async function getReviewsByHost(id) {
    return filterReviewsByHost(id);
}