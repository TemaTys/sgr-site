# tysiatskii.com — Artem Tysiatskii / SGR site

Static, bilingual (RU/EN) informational site for independent researcher **Artem Tysiatskii** (TemaTys), showcasing the **Seleno-Gravitational Rhythm (SGR)** research project.

Live: https://tysiatskii.com

## Structure

8 static HTML pages (4 sections × 2 languages), no build step, no framework:

```
/ ru home (Person showcase)
/en/ en home
/hypothesis ru — full article (ScholarlyArticle + Dataset JSON-LD)
/en/hypothesis en — full article
/data ru — findings table (Dataset JSON-LD)
/en/data en — findings table
/faq ru — FAQPage
/en/faq en — FAQPage
```


Plus `robots.txt` and `sitemap.xml` at the root.

## Findings table

`/data` and `/en/data` render client-side from [`assets/data/table.json`](assets/data/table.json) via [`assets/js/data-table.js`](assets/js/data-table.js) — 218 rows from three sources (cross-city meta-analysis, single-database NYC 911/EMS, Google Trends), filterable by lunar trigger, sorted by freshness. Rows that fail part of the robustness battery are flagged, never hidden.

To add a row: append an object to the `rows` array in `assets/data/table.json` following the existing schema — no rebuild needed, the page picks it up on next load.

## Source of truth

All facts, figures, and numbers come verbatim from the seleno-gravitational-rhythm repository (article PDFs, README, CITATION.cff, semantic maps, and official figures). Nothing here is invented or rounded.

## Design

Astronomical-observatory theme: deep navy/graphite background, starfield + d²F/dt² wave motif as decorative SVG, ice-blue/lunar-silver accent, Source Serif 4 display + Inter body + IBM Plex Mono for data/labels. Light and dark modes supported.

## Author

**Artem Tysiatskii** (TemaTys) — independent researcher and software developer, Kaliningrad, Russia. [ORCID](https://orcid.org/0009-0006-1974-7894) · [Zenodo](https://doi.org/10.5281/zenodo.20518660) · [SGR repository](https://github.com/TemaTys/seleno-gravitational-rhythm)
