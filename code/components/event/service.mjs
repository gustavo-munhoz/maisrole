import {readAllEvents, readEvent, readEventsByDates} from "./repository.mjs";

export async function getEvent(id) {
    return readEvent(id);
}

export async function getAll() {
    return readAllEvents();
}

export async function getEventsByDates(date1, date2 = null) {
    return readEventsByDates(date1, date2);
}