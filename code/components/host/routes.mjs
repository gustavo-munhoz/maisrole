import {getHost, hostReviews, login, register, removeHost, saveHost, saveReview, showRating,} from "./service.mjs";

/**
 * @openapi
 * /hosts/register:
 *   post:
 *     summary: "Registers a new host"
 *
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: hostRegister
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/HostRegister"
 *     responses:
 *       '201':
 *         description: "Host registered"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Registration failed"
 */
export async function hostRegister(req, res, _) {
    const saved = await register(req.body);
    return saved ? res.sendStatus(201) : res.sendStatus(400);}

/**
 * @openapi
 * /hosts/login:
 *   post:
 *     summary: "Logs the host in"
 *
 *     tags:
 *       - "hostAuth"
 *
 *     operationId: hostLogin
 *
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EmailPassword"
 *
 *     responses:
 *       '200':
 *         description: "Host logged in"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Login failed"
 */
export async function hostLogin(req, res, _) {
    const host = await login(req.body);
    return host ? res.json(host) : res.sendStatus(401);
}

/**
 * @openapi
 * /hosts/me:
 *   get:
 *     summary: "Retrieves host information"
 *
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: printHost
 *     x-eov-operation-handler: host/routes
 *
 *     responses:
 *       '200':
 *         description: "Returns the user"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - {}
 *       - JWT: ['HOST']
 */
export async function printHost(req, res, _) {
    if (!req.user) res.send("Hello, guest!");

    const user = await getHost(parseInt(req.user.id), true);
    return user ? res.json(user) : res.sendStatus(404);
}


/**
 * @openapi
 * /hosts/me:
 *   delete:
 *     summary: "Deletes the current Host"
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: deleteAccount
 *     x-eov-operation-handler: host/routes
 *
 *     responses:
 *       '200':
 *         description: "Account deleted successfully"
 *       '404':
 *         description: "Host not found"
 *
 *     security:
 *       - JWT: ['HOST']
 */
export async function deleteAccount(req, res, _) {
    const deleted = await removeHost(req.user.id);
    return deleted ? res.sendStatus(200) : res.sendStatus(404);
}

/**
 * @openapi
 * /hosts/me:
 *   put:
 *     summary: "Updates host information"
 *
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: updateAccount
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/Update"
 *
 *     responses:
 *       '200':
 *         description: "User updated successfully"
 *       '400':
 *         description: "Invalid data provided"
 *       '404':
 *         description: "Host not found"
 *
 *     security:
 *       - JWT: ['HOST']
 */

export async function updateInfo(req, res, _) {
    const saved = await saveHost({id: req.user.id, ...req.body});
    return saved ? res.json({id: req.user.id, ...req.body}) : res.sendStatus(404);
}

/**
 * @openapi
 * /hosts/{id}/reviews:
 *   post:
 *     summary: "Adds a review to target host"
 *     tags:
 *       - "hostReviews"
 *
 *     operationId: addReview
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Review"
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the host to post review
 *
 *     responses:
 *       '201':
 *         description: 'Created review'
 *
 *     security:
 *       - JWT: ['USER']
 *
 */
export async function addReview(req, res, _) {
    const rated = await saveReview(req.params.id, req.user.id, req.body.rating, req.body.text);
    return rated ? res.json(rated) : res.sendStatus(400);
}

/**
 * @openapi
 * /hosts/{id}/reviews:
 *  get:
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *
 *    summary: "Get all reviews"
 *    tags:
 *      - "hostReviews"
 *
 *    operationId: allReviews
 *    x-eov-operation-handler: host/routes
 *
 *    responses:
 *     '200':
 *       description: "Returns reviews"
 *     '404':
 *       description: "Host not found"
 *
 */
export async function allReviews(req, res, _) {
    const all = await hostReviews(req.params.id)
    return all ? res.json(all) : res.sendStatus(404)
}

/**
 * @openapi
 * /hosts/{id}/rating:
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
export async function printRating(req, res, _) {
    const rating = await showRating(req.params.id);
    return rating ? res.json({rating}) : res.sendStatus(404);
}