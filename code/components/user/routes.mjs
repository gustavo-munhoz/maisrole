import {getReviewsByUser, getUser, login, register, removeUser, saveUser} from "./service.mjs";

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: "Registers a new user"
 *
 *     tags:
 *       - "userProfile"
 *
 *     operationId: userRegister
 *     x-eov-operation-handler: user/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/RegisterUser"
 *     responses:
 *       '201':
 *         description: "User registered"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Registration failed"
 */
export async function userRegister(req, res, _) {
    const saved = await register(req.body);
    return saved ? res.sendStatus(201) : res.sendStatus(400);
}

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: "Logs the user in"
 *
 *     tags:
 *       - "auth"
 *
 *     operationId: userLogin
 *
 *     x-eov-operation-handler: user/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginUsernamePassword"
 *
 *     responses:
 *       '200':
 *         description: "User logged in"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Login failed"
 */
export async function userLogin(req, res, _) {
    const user = await login(req.body);
    return user ? res.json(user) : res.sendStatus(401);
}

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: "Retrieves user information"
 *
 *     tags:
 *       - "userProfile"
 *
 *     operationId: printUser
 *     x-eov-operation-handler: user/routes
 *
 *     responses:
 *       '200':
 *         description: "Returns the user"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - {}
 *       - JWT: ['USER']
 */
export async function printUser(req, res, _) {
    if (!req.user) res.send("Hello, guest!");

    const user = await getUser(parseInt(req.user.id), true);
    return user ? res.json(user) : res.sendStatus(404);
}

/**
 * @openapi
 * /info:
 *   get:
 *     summary: "Retrieves creators information"
 *
 *     tags:
 *       - "userProfile"
 *
 *     operationId: showCreators
 *     x-eov-operation-handler: user/routes
 *
 *     responses:
 *       '200':
 *         description: "Returns the creator information"
 *
 */
export async function showCreators(req, res, _) {
    return res.json({
        creator1: await getUser(2, true),
        creator2: await getUser(3, true)});
}

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: "Deletes the current user"
 *     tags:
 *       - "userProfile"
 *
 *     operationId: deleteAccount
 *     x-eov-operation-handler: user/routes
 *
 *     responses:
 *       '200':
 *         description: "Account deleted successfully"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - JWT: ['USER']
 */
export async function deleteAccount(req, res, _) {
    const deleted = await removeUser(req.user.id);
    return deleted ? res.sendStatus(200) : res.sendStatus(404);
}

/**
 * @openapi
 * /users/me:
 *   put:
 *     summary: "Updates user information"
 *
 *     tags:
 *       - "userProfile"
 *
 *     operationId: updateAccount
 *     x-eov-operation-handler: user/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/UpdateUser"
 *
 *     responses:
 *       '200':
 *         description: "User updated successfully"
 *       '400':
 *         description: "Invalid data provided"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - JWT: ['USER']
 */
export async function updateAccount(req, res, _) {
    const saved = await saveUser({id: req.user.id, ...req.body});
    return saved ? res.json({id: req.user.id, ...req.body}) : res.sendStatus(404);
}

/**
 * @openapi
 * /users/{id}/reviews:
 *  get:
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *
 *    summary: "Get all reviews made by user"
 *    tags:
 *      - "hostReviews"
 *
 *    operationId: showReviewsByUser
 *    x-eov-operation-handler: user/routes
 *
 *    responses:
 *     '200':
 *       description: "Returns reviews"
 *     '404':
 *       description: "User not found"
 *
 */
export async function showReviewsByUser(req, res, _) {
    const reviews = await getReviewsByUser(req.params.id);
    return reviews.length !== 0 ? res.json(reviews) : res.sendStatus(404)
}