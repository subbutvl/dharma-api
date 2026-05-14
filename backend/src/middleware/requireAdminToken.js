const { fail } = require("../utils/apiResponse");

/**
 * When `ADMIN_TOKEN` is set in the environment, POST/PUT/PATCH/DELETE under `/api/admin`
 * must send the same value in the `x-admin-token` header.
 * When unset, writes are allowed (local dev only — set a token before exposing publicly).
 */
function requireAdminToken(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (expected == null || String(expected).trim() === "") {
    return next();
  }
  const got = req.headers["x-admin-token"];
  if (got !== expected) {
    return fail(
      res,
      401,
      "Missing or invalid x-admin-token header",
      "ADMIN_AUTH",
    );
  }
  next();
}

module.exports = { requireAdminToken };
