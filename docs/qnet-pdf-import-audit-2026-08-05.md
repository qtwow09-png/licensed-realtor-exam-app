# Q-Net PDF Import Audit - 2026-08-05

## Scope

- Source folder: `source_pdfs/qnet/`
- Local files found: 40 PDF files, 131 MB
- Target data: licensed realtor exam second period, rounds 20-29
- Rule: do not guess answers or question text. Items that cannot be verified from source remain blocked or `needsReview`.

## Source File Status

| Round | Question PDF status | Answer source status | Import status |
|---|---|---|---|
| 20 | 2nd exam PDF is image-only scan. Text extraction returned 0 chars. | EBS/Q-Net final answer is HWP. No local HWP parser available. | OCR/HWP conversion required |
| 21 | 2nd exam PDF is image-only scan. Text extraction returned 0 chars. | EBS/Q-Net final answer is HWP. No local HWP parser available. | OCR/HWP conversion required |
| 22 | 2nd exam PDF is image-only scan. Existing OCR text is too noisy for trusted import. | EBS/Q-Net final answer is HWP. No local HWP parser available. | OCR/HWP conversion required |
| 23 | 2nd exam PDF has only partial extractable text. | EBS/Q-Net final answer is HWP. No local HWP parser available. | OCR/HWP conversion required |
| 24 | 2nd exam PDF is image-only scan. Text extraction returned 0 chars. | EBS/Q-Net final answer PDF downloaded. | OCR required |
| 25 | 2nd exam PDF has extractable text. | EBS/Q-Net final answer PDF downloaded. | Parser needs cleanup; 119/120 parsed in first pass |
| 26 | 2nd exam PDF has extractable text. | EBS/Q-Net final answer Excel downloaded. | Auto-import candidate; 120/120 parsed in first pass |
| 27 | 2nd exam PDF has extractable text. | EBS/Q-Net final answer PDF is image/table-only; text layer contains only headings. | Answer OCR required |
| 28 | 2nd exam PDFs have extractable text. | EBS/Q-Net final answer PDF is image/table-only; text layer contains only headings. | Answer OCR required |
| 29 | 2nd exam PDFs have extractable text. | EBS/Q-Net final answer PDF downloaded. | Auto-import candidate; 120/120 parsed in first pass |

## Downloaded Answer Files

- `tmp/qnet/answers_20_29/20_1.bin`: HWP
- `tmp/qnet/answers_20_29/21_1.bin`: HWP
- `tmp/qnet/answers_20_29/22_1.bin`: HWP
- `tmp/qnet/answers_20_29/23_1.bin`: HWP
- `tmp/qnet/answers_20_29/24_1.pdf`: PDF
- `tmp/qnet/answers_20_29/25_1.pdf`, `25_2.pdf`: PDF
- `tmp/qnet/answers_20_29/26_1.xlsx`: Excel
- `tmp/qnet/answers_20_29/27_1.pdf`: image/table PDF
- `tmp/qnet/answers_20_29/28_1.pdf`: image/table PDF
- `tmp/qnet/answers_20_29/29_1.pdf`, `29_2.pdf`: PDF

## First-Pass Parser Results

| Round | Question starts found | Parsed with 5 choices | Notes |
|---|---:|---:|---|
| 25 | 129 | 119 | Header/footer and old two-column layout need cleanup before DB import |
| 26 | 122 | 120 | Good auto-import candidate |
| 29 | 120 | 120 | Good auto-import candidate. 2nd period second session numbers need offset mapping |

## Current Blockers

1. `tesseract` is not installed on this Mac runtime.
2. Poppler CLI tools such as `pdfinfo` and `pdftotext` are not installed globally.
3. HWP answer files for rounds 20-23 cannot be read without HWP conversion or a parser.
4. Image/table answer PDFs for rounds 27-28 need OCR or manual conversion.
5. Scanned question PDFs for rounds 20-24 need OCR before trusted DB import.

## Safe Next Step

1. Rounds 26 and 29 were imported first as the fast path.
2. Six uncertain questions are stored with `needsReview: true`, so they remain out of the active exam pool.
3. Fix round 25 parser cleanup, then import round 25.
4. Install or provide OCR/HWP conversion for rounds 20-24 and answer PDFs for rounds 27-28.
5. Keep any uncertain questions out of the active pool or mark them `needsReview`.

## Fast Import Result

| Round | Imported total | Active import | `needsReview` | Notes |
|---|---:|---:|---:|---|
| 26 | 120 | 117 | 3 | Three PDF extraction gaps stored as review-only |
| 29 | 120 | 117 | 3 | One PDF extraction gap and two all-answer final-answer items stored as review-only |

After the fast import, `releasedExamQuestions.json` contains 1,080 questions across nine rounds: 26, 29, and 30-36.

Validation result:

- `npm test`: passed
- `npm run build`: passed
- `git diff --check`: passed

## Git Policy

- `source_pdfs/` is local source material and is ignored by Git.
- Only extracted, verified structured question data should be committed.
