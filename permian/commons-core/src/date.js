var isValidDate = obj => obj instanceof Date && isFinite(obj)

module.exports = {
  epochDateNow: () => Date.now(),
  toEpochDate: obj => {
    var date = new Date(obj)
    if (!isValidDate(date)) {
      throw new Error('Invalid date')
    }
    return date.getTime()
  },
  isoDateNow: () => new Date().toISOString(),
  isDate: obj => obj instanceof Date,
  isValidDate,
  millisecondsNow: () => Date.now(),
  getTimezoneMinutes: () => new Date().getTimezoneOffset(),
  addMilliseconds: (date, ms) => new Date(new Date(date).valueOf() + ms),
  SECOND_MS: 1000,
  MINUTE_MS: 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
  WEEK_MS: 7 * 24 * 60 * 60 * 1000
}
