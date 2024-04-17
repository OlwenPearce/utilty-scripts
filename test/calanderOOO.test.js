// the format here is:

import parseDatesFromBody from "../src/calanderOOO";

const message =
    "\n" +
    "Your time off for 26/04/2024 has now been approved by Your Manager (12345) For more information log in to Workday.\n" +
    "\n" +
    " Business Process: Absence Request: Your Name (56789)\n" +
    " Subject: Your Name (56789)\n" +
    " Details: Absence Request for Your Name (56789) effective on 18/04/2024"
// Note here the end date appears at the top and the start date appears at the bottom


test('updater', () => {
    const result = parseDatesFromBody(message)
    expect(result).toBe({
        startDate: "18/04/2024",
        endDate: "26/04/2024"
    });
});
