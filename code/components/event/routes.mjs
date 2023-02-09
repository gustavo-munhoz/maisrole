import { getEvent} from "./service.mjs";

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get the rating of a host by ID
 *
 *     tags:
 *       - hostReviews
 *
 *     operationId: printRating
 *     x-eov-operation-handler: host/routes
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the host to get rating
 *
 *     responses:
 *       '200':
 *         description: "Returned rating"
 *       '404':
 *         description: "Host not found"
 */
export async function printEvent(req, res, _) {
    const event = await getEvent(req.params.id);
    return event ? res.json(event) : res.sendStatus(404);
}