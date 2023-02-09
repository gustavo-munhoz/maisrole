import {readEvent} from "./repository.mjs";

export async function getEvent(id) {
    return readEvent(id);
}

