const checkDateTime = (request, response, next) => {
  try {
    const currDate = _currDateFormatted()
    if(currDate <= request.body.event_date && (request.body.event_start < request.body.event_end)) {
      next()
    } else {
      request.flash("error", "Please select a correct date time");
      response.redirect("/dashboard");
    }
  } catch (error) {
    request.flash("error", error.message)
  }
}

const _currDateFormatted = () => {
  const currDate = new Date()
  return currDate.toISOString().slice(0, 10)
}

module.exports = {checkDateTime};