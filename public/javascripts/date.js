var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
var getReadableDate = function (date, withHours)  {

  if (!date) return '';

  date = new Date(date);

  var day = date.getDate();
  var month = months[date.getMonth()];
  var dateStr = `${day} ${month}`;

  if (withHours)
    dateStr += ` ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;

  return dateStr;
};
