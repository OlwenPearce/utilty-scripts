# Scripts

## Email to Calendar Script
This script is intended to update google calendar with leave based on an automated email sent when leave is approved in workday.
When set up, it creates an event for these the days including the text OOO, which the google calendar slack app uses to identify
you as out of office.

### How to set up the integration
#### Create a filter in gmail
Create a custom label for emails you want the script to process. Look for the "myworkday.com" sender and containing 
the text "time off" + "has been approved"

#### Set up a slack integration (optional)
Set up the google calendar slack app to update your slack status when you're out of office. This will be triggered by the 
text "OOO" this script puts in the title of your personal event to mark you as out of office when on leave.

#### Set up the script
1. Go to https://script.google.com/ and create a new script, then paste the contents of the file "calanderOOO"" in.
2. Update the label name to match what you've picked above.
3. Update other variables. If you want to copy the event into other calendars (e.g. "department holiday calendar") as well as your personal calendar,
add these to the HOLIDAY_CALENDAR_IDS array and put your own name in "[My name]". The id of a calendar can be found 
under the "settings" tab for the calendar in question.
4. Hit save. You should now be able to run "getEmail" to test it (you can mark old/existing time off email as unread 
to see it work).
5. Create a trigger to run the function "getEmail". I selected daily here.

#### Letting it run
This script only looks for unread emails, so remember not to read these automated emails - moving them into a folder 
based on the label can help stop this!

### Further improvements
Possible further improvements are:
- use a different CalendarApp function to mark out of office instead of creating the event
- also look for "your time off has been updated" type emails and update based on this
