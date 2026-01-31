const { addDays, addWeeks, addMonths, parseISO, format, isBefore, isAfter, isEqual } = require('date-fns');

function expandRecurrence(dueDate, recurrence, rangeFrom, rangeTo) {
  if (!recurrence) return [dueDate];

  const start = parseISO(dueDate);
  const from = parseISO(rangeFrom);
  const to = parseISO(rangeTo);
  const dates = [];

  let current = start;
  while (!isAfter(current, to)) {
    if ((isAfter(current, from) || isEqual(current, from)) &&
        (isBefore(current, to) || isEqual(current, to))) {
      dates.push(format(current, 'yyyy-MM-dd'));
    }
    current = advanceDate(current, recurrence);
  }

  return dates;
}

function advanceDate(date, recurrence) {
  switch (recurrence) {
    case 'daily': return addDays(date, 1);
    case 'weekly': return addWeeks(date, 1);
    case 'biweekly': return addWeeks(date, 2);
    case 'monthly': return addMonths(date, 1);
    default: return addDays(date, 1);
  }
}

module.exports = { expandRecurrence };
