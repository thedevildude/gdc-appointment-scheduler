//const { Event } = require("../../models");

const checkDateTime = (request, response, next) => {
  try {
    const currDate = _currDateFormatted()
    if(currDate <= request.body.event_date && (request.body.event_start < request.body.event_end)) {
      //const user_id = request.user.id;
      //const events = Event.findAll({where: {user_id}});
      /* if (checkTimeSlot({
        events,
        event_date: request.body.event_date,
        event_start: request.body.event_start,
        event_end: request.body.event_end,
      })) { */
        next()
      /* } else {
        console.log("Time Slot not available");
        throw new Error("Time Slot not available");
      } */
    } else {
      request.flash("error", "Please select a correct date time");
      response.redirect("/dashboard");
    }
  } catch (error) {
    request.flash("error", error.message)
    response.redirect("/dashboard");
  }
}

const _currDateFormatted = () => {
  const currDate = new Date()
  return currDate.toISOString().slice(0, 10)
}

/* const checkTimeSlot = ({events, event_date, event_start, event_end}) => {
  for(let i=0; i<events.length; i++){
    if(event_date == events[i].event_date) {
      if(event_start == events[i].event_start.slice(0, 5) || event_end == events[i].event_end.slice(0, 5)) {
        return false;
      } else if (event_start < events[i].event_start.slice(0,6)) {
        if (event_end >= events[i].event_start.slice(0,6)) {
          return false;
        } else continue;
      } else if (event_start > events[i].event_start.slice(0,6)) {
        if (event_start < events[i].event_end.slice(0,6)) {
          return false;
        } else continue;
      }
    } else continue;
  }
  return true;
} */

const compare = ( event1, event2 ) => {
  if (event1.event_start > event2.event_start){
    return 1;
  }
  if ( event1.event_start < event2.event_start){
    return -1;
  }
  return 0;
}

const eventSort = (events) => {
  const _events = events.sort(compare);
  return _events;
}

const compareLater = (event1, event2) => {
  if (event1.event_date > event2.event_date){
    return 1;
  }
  if ( event1.event_date < event2.event_date){
    return -1;
  }
  return 0;
}

const eventSortLater = (events) => {
  const _events = events.sort(compareLater)
  return _events;
}

module.exports = {checkDateTime, eventSort, eventSortLater};