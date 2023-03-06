const { Event } = require("../../models");

const checkDateTime = async (request, response, next) => {
  try {
    const currDate = _currDateFormatted();
    if (
      currDate <= request.body.event_date &&
      request.body.event_start < request.body.event_end
    ) {
      const user_id = request.user.id;
      const events = await Event.findAll({ where: { user_id } });
      if (
        checkTimeSlot(
          events,
          request.body.event_date,
          request.body.event_start,
          request.body.event_end
        )
      ) {
        next();
      } else {
        throw new Error("Time Slot not available");
      }
    } else {
      throw new Error("You cannot schedule event for old date/time");
    }
  } catch (error) {
    request.flash("error", error.message);
    response.redirect("/dashboard");
  }
};

const _currDateFormatted = () => {
  return toIsoString(new Date()).slice(0, 10);
};

const checkTimeSlot = (events, event_date, event_start, event_end) => {
  for (let i = 0; i < events.length; i++) {
    if (event_date == events[i].event_date) {
      if (
        event_start === events[i].event_start.slice(0, 5) ||
        event_end + ":00" === events[i].event_end.slice(0, 5)
      ) {
        return false;
      } else if (event_start < events[i].event_start.slice(0, 5) && event_end > events[i].event_start.slice(0, 5)) {
          return false;      
      } else if (event_start > events[i].event_start.slice(0, 5) && event_start < events[i].event_end.slice(0, 5)) {
          return false;
      } else continue;
    }
  }
  return true;
};

const compare = (event1, event2) => {
  if (event1.event_start > event2.event_start) {
    return 1;
  }
  if (event1.event_start < event2.event_start) {
    return -1;
  }
  return 0;
};

const eventSort = (events) => {
  const _events = events.sort(compare);
  return _events;
};

const compareLater = (event1, event2) => {
  if (event1.event_date > event2.event_date) {
    return 1;
  }
  if (event1.event_date < event2.event_date) {
    return -1;
  }
  return 0;
};

const eventSortLater = (events) => {
  const _events = events.sort(compareLater);
  return _events;
};

const toIsoString = (date) => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
};

module.exports = { checkDateTime, eventSort, eventSortLater, toIsoString };
