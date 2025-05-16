# Rubin 2025 Project (aka Rubin Landing Page)

This folder contains everything related to the Rubin Landing Page, i.e. https://www.zooniverse.org/rubin

Context:
- The Vera C. Rubin observatory is getting a bunch of new astronomical data in June/July 2025, which will be followed up by a press announcement telling people they can participate via citizen science (i.e. Zooniverse)
- Since it'll take some time (approx 2 weeks) between the press announcement going out and the data being ready for volunteers to classify, we need a "Landing Page" to 1. let people know that the data is being processed, and 2. let them register in the meantime, so they'll receive a newsletter informing them when the data is ready for classification, and 3. (after the data is ready) direct volunteers to the appropriate project pages.

Features & Scope:
- The Rubin Landing Page is a copy of our standard stand-alone registration page - https://www.zooniverse.org/accounts/register - except that it has some additional text content about the Rubin 2025 project.

Project notes:
- Project lead: Cliff ; main dev: Shaun
- Initiated early May 2025
- expected lifespan until end of 2025

Dev considerations:
- "Rubin 2025 project" is just the dev term.
- We're basically copying the PFE "registration page" code, with the understanding that this Landing Page will eventually be deleted once it has completed its purpose.

Other files modified:
- `app/router.jsx` - additional routes added for `www.zooniverse.org/rubin`
