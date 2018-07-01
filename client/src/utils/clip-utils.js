export function formatMilliseconds (milliseconds) {
  // Format milli
  milliseconds = milliseconds % 3600000

  // Format minutes
  var minutes = Math.floor(milliseconds / 60000)
  milliseconds = milliseconds % 60000

  // Format seconds
  var seconds = Math.floor(milliseconds / 1000)
  milliseconds = Math.floor(milliseconds % 1000)
  return (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds + '.' + milliseconds
}

export function formatBytes (bytes, decimals) {
  if (bytes === 0) return '0 Bytes'
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}