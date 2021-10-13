var constants = {
  CONTENTTYPE_OCTET_STREAM: 'application/octet-stream',
  CONTENTTYPE_JSON: 'application/json',
  CONTENTTYPE_XML: 'application/xml',
  CONTENTTYPE_HTML: 'text/html',
  CONTENTTYPE_CSS: 'text/css"',
  CONTENTTYPE_JAVASCRIPT: 'text/javascript',
  CONTENTTYPE_TEXT: 'text/plain',
  CONTENTTYPE_GZIP: 'application/gzip',
  HEADER_CONTENTTYPE: 'Content-Type',
  HEADER_CONTENTENCODING: 'Content-Encoding',
  STATUS_OK: 200,
  STATUS_BAD_REQUEST: 400,
  STATUS_FORBIDDEN: 403,
  STATUS_NOT_FOUND: 404,
  STATUS_METHOD_NOT_ALLOWED: 405,
  STATUS_ERROR: 500,
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
  PING_PATH: 'PING',
  PING_OK: Object.freeze({ pingOk: 1 })
}

constants.ALLOWED_METHODS = Object.freeze([constants.GET, constants.PUT, constants.POST, constants.DELETE])

module.exports = Object.freeze(constants)
