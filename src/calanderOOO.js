// Create Google Calendar events from sending an email in Gmail
// Modified by Olwen Pearce off a script from Al Chen (al@coda.io)
// This modification is based around the standard format for workday absence emails
// And currently only creates new OOO without updating
// See full writeup here: https://www.thekeycuts.com/dear-analyst-76-productivity-hack-for-creating-a-google-calendar-event-by-sending-yourself-an-email/

//////////////// Setup and global variables ////////////////////////////////

//this must be set up as a gmail filer
//select emails from workday and containing "time off" + "has been approved"
GMAIL_LABEL = 'leave-approved'
DEFAULT_EVENT_TIME = 30
DATE_FORMAT = 'ROW' // US (m/d/y) or ROW (d/m/y)

////////////////////////////////////////////////////////////////////////////

function getEmail() {
    var label = GmailApp.getUserLabelByName(GMAIL_LABEL);
    var threads = label.getThreads();

    // Only create events for unread messages in the GMAIL_LABEL
    for (var i = 0; i < threads.length; i++) {
        if (threads[i].isUnread()) {
            var emailSubject = threads[i].getFirstMessageSubject()
            var emailMessage = threads[i].getMessages()[0].getPlainBody()
            var [eventTitle, startTime, endTime, isAllDay, optionalParams] = parseEmail(emailSubject, emailMessage)
            createEvent(eventTitle, startTime, endTime, isAllDay, optionalParams)
            threads[i].markRead()
        }
    }
}

function parseDatesFromBody(message) {
    var dateRegex = "[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}"
    var lines = message.split(/\r?\n/)

    //filter search is used here to make the solution more resilient
    var lineWithEndDate = lines.filter(line => line.includes("Your time off for"))[0]
    var lineWithStartDate = lines.filter(line => line.includes("Details: Absence Request"))[0]

    var endDate = lineWithEndDate.match(dateRegex)[0]
    var startDate = lineWithStartDate.match(dateRegex)[0]

    return [ startDate, endDate ]
}

function parseEmail(subject, message) {
    // Assumes an all day event for holidays - this could later be modified
    var allDay = true

    // Convert dates/times into useable format
    var [startDate, endDate] = parseDatesFromBody(message)

    var [startDateFormatted, endDateFormatted] = calcDateTime(startDate, endDate)

    Logger.log("creating event for date " + startDate + " to " + endDate)

    var optionalParams = {guests: undefined, description: "created by workday => email automation"}

    return ["OOO: on leave", startDateFormatted, endDateFormatted, allDay, optionalParams]
}

function createEvent(eventTitle, startTime, endTime, isAllDay, optionalParams) {
    Logger.log("creating event " + eventTitle + " for date " + startTime + " to " + endTime)

    var event = CalendarApp.getDefaultCalendar().createAllDayEvent(eventTitle, startTime, endTime, optionalParams)

    Logger.log('Event Added: ' + eventTitle + ', ' + startTime + '(ID: ' + event.getId() + ')');
}

function calcDateTime(startDate, endDate) {
    var [startMonth, startDay, startYear] = parseDate(startDate)
    var [endMonth, endDay, endYear] = parseDate(endDate)
    var newDateStart = new Date(startYear, startMonth - 1, startDay)
    var newDateEnd = new Date(endYear, endMonth - 1, endDay)

    return [newDateStart, newDateEnd]
}

// Get month, day, year from date with slash
function parseDate(date) {
    var dateDetails = date.split("/")


    var month = parseInt(dateDetails[1].trim())
    var day = parseInt(dateDetails[0].trim())
    var year = parseInt(dateDetails[2].trim());

    return [month, day, year]
}

//exports - these can be removed when pasting
module.exports = parseDatesFromBody
