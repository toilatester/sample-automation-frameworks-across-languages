const { invert } = require('lodash');

const statuses = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  NOT_MODIFIED: 304,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUEST: 429,

  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const invertStatuses = invert(statuses);
const getStatusName = (statusCode) => invertStatuses[`${statusCode}`];

module.exports = Object.assign({}, statuses, { getStatusName });
