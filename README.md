# AiGo — веб-версия

Next.js 16 + Tailwind CSS 4 + next-intl. Языки: узбекский (uz), русский (ru, по умолчанию), английский (en).

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000 — сайт перенаправит на `/ru`. Язык переключается в шапке (UZ / RU / EN).

## Страницы

- `/[locale]` — главная: что происходит с профессиями, примеры, методика, программа, AI Tutor
- `/[locale]/start` — онбординг: возраст → факты → квиз → главный вывод → интересы
- `/[locale]/app` — кабинет ученика, `/app/path`, `/app/lesson` (AI Tutor), `/app/portfolio`

## Где что лежит

- `messages/{uz,ru,en}.json` — все тексты. Ключи во всех трёх файлах одинаковые
- `src/i18n/` — настройка локалей, `src/proxy.ts` — редирект на язык
- `src/app/globals.css` — токены дизайна (совпадают с Figma и мобильным приложением)
- `src/lib/progress.tsx` — прогресс ученика (XP, интересы), хранится в localStorage
