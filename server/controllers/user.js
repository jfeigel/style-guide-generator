/**
 * @module UserController
 * @category Backend
 * @requires UserModel
 */
import { create } from '../models/user';

/**
 * Tells the UserModel to create a new User
 *
 * @async
 * @function
 * @instance
 * @param {object} ctx Koa Context
 */
export const register = async function register(ctx) {
  try {
    const result = await create(ctx.request.body, true);
    if (result && result.error) {
      ctx.throw(result.status, result.message);
    }
    ctx.status = 201;
  } catch (err) {
    ctx.throw(err);
  }
};
