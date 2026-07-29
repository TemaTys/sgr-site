# tysiatskii.com — Artem Tysiatskii / SGR site

Static, bilingual (RU/EN) informational site for independent researcher **Artem Tysiatskii**, showcasing the **Seleno-Gravitational Rhythm (SGR)** research project.

## Structure

8 server-rendered HTML pages (4 sections × 2 languages), no JS framework, no build step required to view:

```
/               ru home (Person showcase)
/en/            en home
/hypothesis     ru — full article (ScholarlyArticle + Dataset JSON-LD)
/en/hypothesis  en — full article
/data           ru — findings table (Dataset JSON-LD)
/en/data        en — findings table
/faq            ru — FAQPage
/en/faq         en — FAQPage
```

Plus `robots.txt` and `sitemap.xml` at the root.

## Editing the findings table

Open `data/table.json`. Copy one object from the `rows` array, edit the fields (see `_instructions_ru` / `_instructions_en` inside the file for details — including the `_en` suffix fields needed for the English page), and insert it before the closing `]`. Leave `google_trends` as `null` until real data is available.

After editing `data/table.json` (or any `content_*.py` file), regenerate the static HTML:

```bash
python3 build.py
```

This rewrites all 8 `index.html` files from the Python templates in `build.py` + `content_home.py` + `content_faq.py` + `content_data.py` + `content_hypothesis.py`.

## Source of truth

All facts, figures, and numbers are taken verbatim from `/home/user/workspace/sgr_source/` (the SGR article in RU/EN, README, CITATION.cff, semantic_map.md, and the three official figures). Nothing is invented or rounded arbitrarily.

## Design

Astronomical-observatory theme: deep navy/graphite background, starfield + d²F/dt² wave motif as decorative SVG, ice-blue/lunar-silver accent, Source Serif 4 display + Inter body + IBM Plex Mono for data/labels. Light and dark modes both supported.
