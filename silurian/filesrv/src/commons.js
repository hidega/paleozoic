var commons = require('@permian/commons')

module.exports = {
  resolvePath: commons.files.resolvePath,
  whenBuilder: commons.lang.whenBuilder,
  matcherBuilder: commons.lang.matcherBuilder,
  throwError: commons.lang.throwError,
  assignRecursive: commons.lang.assignRecursive,
  try: commons.lang.try,
  streamEvents: commons.stream.events,
  requestPath: {
    getFile: 'get-file',
    listDirectory: 'list-directory'
  },
  fileTypes: {
    TYPE_DIR: 'dir',
    TYPE_FILE: 'file',
    TYPE_OTHER: 'other'
  }
}
