# PS-07 Pilot and Adoption Plan

## Pilot scope

Run a four-week pilot with one department, one hostel, the examination cell, and a small student cohort. Start with three end-to-end services already represented in the prototype: class leave approval, hostel outpass approval, and campus service tickets. Add assignment publishing and grading as the academic workflow demonstration.

## Moving from current habits

1. Map the current owner and approval steps for each selected service before moving it online.
2. Import only active requests from spreadsheets or paper registers, with an owner and last-updated date. Keep completed history available to the office during the pilot.
3. Publish routine updates in the portal and retain existing notice channels during the pilot. Link back to one official notice record so students know which version is current.
4. Train each desk using a short checklist and give every request a visible reference number, status, assigned office, and resolution note.
5. Review queue age, repeat issue categories, resolution time, and notice reads/actions weekly. Fix unclear ownership or steps before expanding to more departments.

## Access for students with limited connectivity or no smartphone

- Keep the interface responsive, text-first, and split into screens that load only when opened. Cache the previously loaded app shell for return visits when the network drops.
- Save prototype changes in the current browser and clearly tell users when they are offline. The current prototype does not sync those changes to a server or another device.
- Provide a staffed campus service counter. Staff can register a walk-in request on the student's behalf and give them its tracking number; the student can return to the counter or use an available phone to check status.
- Before a university pilot, agree on an approved SMS/printed receipt fallback for urgent status updates and provide an accessible language option for each service desk.

## Requirements before a live university rollout

The current application is a front-end prototype with sample records and browser-local storage. A real rollout needs a university-managed API and database, verified student/staff identity, server-enforced permissions, durable audit history, backups, and an approved retention policy. Integrate with the university's source of truth for enrollment, fees, results, timetables, and hostel allocation before displaying those values as official. Do not treat prototype login credentials or browser storage as production security.

## Pilot measures

- Median time from request submission to first staff action.
- Number and age of unresolved requests, including requests older than 48 hours.
- Median time to resolution and the most repeated issue categories.
- Notice delivery to the selected cohort, read rate, and action rate.
- Student and staff completion rate for each workflow, including assisted-counter requests.
