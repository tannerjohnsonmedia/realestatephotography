# FLNT Films business card

| File | Use |
|------|-----|
| `flnt-business-card-print.pdf` | **Send this to the printer.** Page 1 is the front, page 2 the back. |
| `flnt-business-card-front.png`, `flnt-business-card-back.png` | 300 dpi images of each side, for printers that ask for images instead of a PDF |
| `preview.png` | What the trimmed cards look like |
| `card.html` | Source. Edit it, then re-export the PDF (below). |

## Print specs

- Trim size: 3.5 x 2 in (US standard)
- File size: 3.75 x 2.25 in, which includes a 0.125 in bleed on every side
- Safe area: all type is at least 0.125 in inside the trim line
- Fonts: embedded (Archivo, IBM Plex Mono)
- Colors: RGB. Printers convert to CMYK, so the orange (#FF5A1F) can print slightly duller.
  Ask for a printed proof if the exact orange matters.
- Suggested stock: 16 pt or heavier, matte or uncoated, double-sided

## Re-exporting after an edit

Open `card.html` in Chrome, choose Print, set the destination to Save as PDF, margins to None and
turn on Background graphics. The page size (3.75 x 2.25 in) is set in the file.
