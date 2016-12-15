

export function formatMilliseconds(milliseconds) {
  // Format hours
  var hours = Math.floor(milliseconds / 3600000);
  milliseconds = milliseconds % 3600000;

  // Format minutes
  var minutes = Math.floor(milliseconds / 60000);
  milliseconds = milliseconds % 60000;

  // Format seconds
  var seconds = Math.floor(milliseconds / 1000);
  milliseconds = Math.floor(milliseconds % 1000);
  return (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds + '.' + milliseconds;
}