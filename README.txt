PINCHA AND ASSOCIATES — WEBSITE  (read me)
===========================================================================

WHAT YOU HAVE
-------------
A multi-page website (like a proper firm site), all sharing one design and
one data file:

  index.html      Home
  about.html      About us + how we work
  services.html   Services (detailed)
  offices.html    All office locations   (Google-Sheet editable)
  careers.html    Articleship + jobs + current openings   (Sheet editable)
  insights.html   News / updates   (Sheet editable, add as many as you like)
  contact.html    Contact + enquiry form
  style.css       The look (colours, layout) — shared by every page
  site.js         The content engine (Google Sheets + defaults)
  ca-india-logo.png   <-- YOU ADD THIS (see "LOGO" below)

To put it online: upload the WHOLE folder to any web host. Keep all files
together in the same folder. Open index.html to preview locally.


LOGO  (important)
-----------------
The old emblem has been removed. The header now loads a file called
  ca-india-logo.png
Download the official "CA India" logo from ICAI (icai.org — see ICAI's logo
usage guidelines; you must use the approved artwork and not alter its colours
or proportions). Save it as  ca-india-logo.png  in this folder.
If the file is missing, the site simply shows the firm name in text — nothing
breaks.


EDITING CONTENT FROM GOOGLE SHEETS  (the main thing you asked for)
------------------------------------------------------------------
Open site.js. Right at the top there is a full step-by-step guide. In short:

  1. Make ONE Google Sheet with 5 tabs named exactly:
        settings   offices   insights   openings   team
  2. Fill them using the layouts shown in site.js.
        - settings : email, careers_email, phone, whatsapp
        - offices  : city, type, address, state   (add/remove branches freely)
        - insights : date, tag, title, text       (add as many updates as you want)
        - openings : role, location, type
        - team     : cas, staff   (the two numbers on the home page)
  3. Share -> "Anyone with the link" -> Viewer.
  4. Copy the Sheet ID from the URL and paste it into  SHEET_ID = "..."  in site.js.
  5. Save & re-upload site.js.

After that, you change the SHEET — not the code — and every page updates by
itself (email, branches, insights, openings, team counts).

Until you do this, the site shows the correct DEFAULT content already built
in (your real offices, phone, sample insights, etc.), so it works right now.

NOTE: a published sheet is publicly readable. Only put information meant for
the public in it (no private data).


STILL TO DO BEFORE GOING LIVE
-----------------------------
- Add ca-india-logo.png (above).
- Replace the stock photos with your own / licensed images. Search the .html
  files for "unsplash" to find them. Your own office & team photos look far
  better than stock.
- Set a real email (in the Google Sheet "settings" tab, or temporarily in the
  DEFAULTS section of site.js).
- Replace the map: on contact.html, swap the OpenStreetMap iframe for your
  Google Maps embed (Google Maps -> your office -> Share -> Embed a map).
- Pick a domain and intimate the website address to ICAI.


ICAI NOTE
---------
Content is kept factual and informational (no "best/leading", no comparative
claims, no client names, no offers). Keep Insights factual/educational, not
promotional. The footer carries the standard disclaimer. The revised 13th
Edition Code of Ethics (effective 1 April 2026) is more permissive but still
bars solicitation — keep the site on a "pull" basis (let people come to it;
don't mass-circulate its contents). Confirm anything you're unsure about with
ICAI's Ethical Standards Board (esb.icai.org).
===========================================================================
