function ok(res, data, meta) {
  const body = { success: true, data };
  if (meta !== undefined && meta !== null) {
    body.meta = meta;
  }
  res.json(body);
}

function fail(res, status, message, code) {
  const body = { success: false, message };
  if (code) {
    body.code = code;
  }
  res.status(status).json(body);
}

module.exports = { ok, fail };
