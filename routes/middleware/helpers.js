const checkDateTime = (request, response, next) => {
  try {
    if(request.body.event_start < request.body.event_end) {
      console.log("Function working");
      next()
    } else {
      request.flash("error", "Please select a correct time");
      response.redirect("/dashboard");
    }
  } catch (error) {
    request.flash("error", error.message)
  }
}

module.exports = {checkDateTime};