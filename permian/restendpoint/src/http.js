module.exports = Object.freeze({
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
  STATUS_NOT_FOUND: 404,
  STATUS_FORBIDDEN: 403,
  STATUS_BAD_REQUEST: 400,
  STATUS_ERROR: 500,
  ALLOWED_METHODS: Object.freeze(['GET', 'PUT', 'POST', 'DELETE'])
})
