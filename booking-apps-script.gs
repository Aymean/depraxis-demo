/**
 * De Praxes booking bridge — Google Apps Script Web App.
 * Bound to a Google Calendar. The site's booking form calls this directly
 * (no server of ours involved) to check real availability and write the
 * appointment straight onto the calendar. See HANDOFF.md "v7" for the
 * deploy steps and the one line to paste into index.html once this is live.
 */

// ==== CONFIG ====
var CALENDAR_ID = "d804be5b4fa88e1a3a1840e5663937d98e9d26a9d1d3e3f12a288355017f131b@group.calendar.google.com";
var APPT_MINUTES = 30;      // how long each appointment blocks on the calendar
var RIYADH_OFFSET = 3;      // Asia/Riyadh is UTC+3 year-round, no DST — hardcoded so this
                             // never depends on whatever timezone this script project happens
                             // to run under (which can silently differ from the clinic's own).

// Converts a "YYYY-MM-DD" + "HH:MM" pair, understood as Riyadh local time, into the
// correct absolute instant — regardless of this script's own project timezone setting.
function riyadhToDate(dateStr, timeStr) {
  var p = dateStr.split("-").map(Number);
  var t = timeStr.split(":").map(Number);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2], t[0] - RIYADH_OFFSET, t[1], 0));
}

function doGet(e) {
  var date = e.parameter.date; // "YYYY-MM-DD"
  if (!date) return jsonOut({ error: "missing date" });

  var cal = CalendarApp.getCalendarById(CALENDAR_ID);
  var dayStart = riyadhToDate(date, "00:00");
  var dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60000); // next midnight, Riyadh time
  var events = cal.getEvents(dayStart, dayEnd);

  var busy = events.map(function (ev) {
    return { start: ev.getStartTime().toISOString(), end: ev.getEndTime().toISOString() };
  });
  return jsonOut({ busy: busy });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var cal = CalendarApp.getCalendarById(CALENDAR_ID);

  var start = riyadhToDate(data.date, data.time);
  var end = new Date(start.getTime() + APPT_MINUTES * 60000);

  // Re-check right before writing — closes the race window between the
  // visitor's availability check and this submit (two people picking the
  // same slot seconds apart).
  var stillFree = cal.getEvents(start, end).length === 0;
  if (!stillFree) {
    return jsonOut({ ok: false, reason: "slot_taken" });
  }

  var title = (data.department || "Appointment") + " — " + data.name;
  var description = [
    "Name: " + data.name,
    "Mobile: " + data.phone,
    "Department: " + data.department,
    data.note ? "Note: " + data.note : null,
    "Booked from the website"
  ].filter(Boolean).join("\n");

  var event = cal.createEvent(title, start, end, { description: description });

  return jsonOut({ ok: true, eventId: event.getId(), start: start.toISOString(), end: end.toISOString() });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
