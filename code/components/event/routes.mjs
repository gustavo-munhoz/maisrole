import {getAll, getEvent, getEventsByDates} from "./service.mjs";

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *
 *     tags:
 *       - events
 *
 *     operationId: printEvent
 *     x-eov-operation-handler: event/routes
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event to get
 *
 *     responses:
 *       '200':
 *         description: "Returned event"
 *       '404':
 *         description: "Event not found"
 */
export async function printEvent(req, res, _) {
    const event = await getEvent(req.params.id);
    return event ? res.json(event) : res.sendStatus(404);
}

/**
 * @openapi
 * /events/all:
 *   get:
 *     summary: Get all existing events
 *
 *     tags:
 *       - "events"
 *
 *     operationId: showAllEvents
 *     x-eov-operation-handler: event/routes
 *
 *     responses:
 *       '200':
 *         description: Returned events
 *       '404':
 *         description: No events found
 */
export async function showAllEvents(req, res, _) {
    const events = await getAll();
    return events.length !== 0 ? res.json(events) : res.sendStatus(404);
}

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Filter events by date interval
 *     description: Use one date to get all events happening in that day. Use two dates to get all events happening during that interval.
 *
 *     tags:
 *       - "events"
 *
 *     operationId: filterEventsByDates
 *     x-eov-operation-handler: event/routes
 *
 *     parameters:
 *       - in: query
 *         name: date1
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date2
 *         required: false
 *         schema:
 *           type: string
 *
 *     responses:
 *       '200':
 *         description: Returned events
 *       '404':
 *         description: No events found
 *
 */
export async function filterEventsByDates(req, res, _) {
    const events = await getEventsByDates(req.query.date1, req.query.date2);
    return events.length !== 0 ? res.json(events) : res.sendStatus(404);
}