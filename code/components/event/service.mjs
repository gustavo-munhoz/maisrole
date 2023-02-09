import {readEvent, deleteEvent, updateEvent} from "./repository.mjs";

export async function getEvent(id) {
    return readEvent(id);
}

export async function removeEvent(id) {
    return deleteEvent(id);
}

export async function saveEvent(id, newData) {
    return updateEvent(id, newData);
}