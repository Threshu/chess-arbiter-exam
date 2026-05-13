# Translations (i18n)

This project is bilingual end-to-end. The UI, content, and audit data all carry Polish and English.

## File structure

```
i18n/locales/
├── pl/
│   ├── common.json    # nav, generic actions, generic errors
│   ├── auth.json      # sign-in flow
│   └── landing.json   # public marketing pages
└── en/
    ├── common.json
    ├── auth.json
    └── landing.json
```

Each top-level JSON file is one **feature namespace**. Components read keys as `t('auth.signInWithGoogle')`, with the namespace as the first segment of the key path. Namespaces are registered per-locale in the `files` array in `nuxt.config.ts`'s `i18n.locales` block — adding a new namespace requires updating both arrays.

## Adding a new key

1. Add the key to the **Polish** file first. Polish is the source-of-truth language for this product (the audience is primarily Polish-speaking arbiter candidates).
2. Mirror the key — with its translation — to the corresponding **English** file in the **same commit**.
3. Run `pnpm i18n:check` locally before pushing. CI will block a merge if it finds key drift.

`pnpm i18n:check` walks both locale trees and builds a set of fully-qualified keys per file pair. The PL set and the EN set must match exactly. Missing keys, extra keys, or keys in only one language all fail the check.

## Adding a new feature namespace

When a new feature (e.g. an exam-runtime UI in Phase 4) needs its own copy:

1. Create `i18n/locales/pl/<feature>.json` and `i18n/locales/en/<feature>.json` in the same commit.
2. Register both file paths under the matching locale in `nuxt.config.ts → i18n.locales[].files`.
3. Reference keys as `t('<feature>.someKey')` from components.

Do not collapse multiple features into `common.json`. The namespacing makes lazy-loading and ownership clearer; bloated `common` is the most common smell in i18n setups.

## Rendering bilingual content from Firestore

Document fields with shape `{ pl: string, en: string }` (e.g. `question.content`, `exam.title`) are **not** part of the i18n message catalog. They are content, not UI strings. Render them through the `localized(value, locale)` helper in `app/utils/localized.ts`, never as `value.pl` or `value.en` directly. The helper falls back gracefully if a translation is missing for the active locale.
