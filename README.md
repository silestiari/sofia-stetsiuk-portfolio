<div align="center">

<img src="docs/readme/banner.jpg" width="100%" alt="Sofia Stetsiuk — portfolio"/>

<a href="https://sofia-stetsiuk-portfolio.vercel.app/en"><img src="https://img.shields.io/badge/Open_portfolio-FF5FA2?style=for-the-badge&logo=vercel&logoColor=white"/></a>
<a href="https://sofia-stetsiuk-portfolio.vercel.app/en#showroom"><img src="https://img.shields.io/badge/3D_Showroom-E0307E?style=for-the-badge&logo=threedotjs&logoColor=white"/></a>
<a href="https://github.com/silestiari"><img src="https://img.shields.io/badge/GitHub_profile-C25BA5?style=for-the-badge&logo=github&logoColor=white"/></a>

<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/React_Three_Fiber-000000?style=flat-square&logo=threedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Motion-FF4D8D?style=flat-square&logo=framer&logoColor=white"/>
<img src="https://img.shields.io/badge/next--intl-EN_·_RU-FF8DC0?style=flat-square"/>
<img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white"/>

</div>

<p align="center">⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ &nbsp; =^･ω･^= &nbsp; ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆</p>

## 🎀 About

My personal portfolio site: **QA Engineer × Game Designer** from Batumi, Georgia. It shows seven projects (three web projects where QA was part of the process from day one, and four Roblox games where I design the systems and test every build), a 3D gallery of my Blender models, and a few small things to play with. I set the tasks, made the design decisions and did the QA.

## 🎮 Projects inside

<table>
<tr>
<td width="25%"><img src="public/media/build-your-pet/cover-en.webp" alt="Build Your Own Pet"/><br/><b>Build Your Own Pet</b><br/><sub>Roblox</sub></td>
<td width="25%"><img src="public/media/cabin-chaos/cover-en.webp" alt="Cabin Chaos"/><br/><b>Cabin Chaos</b><br/><sub>Roblox</sub></td>
<td width="25%"><img src="public/media/pillars/cover-1-en.webp" alt="PILLARS: Hide & Stack"/><br/><b>PILLARS: Hide & Stack</b><br/><sub>Roblox</sub></td>
<td width="25%"><img src="public/media/woodcutter-vs-zombies/cover-1-en.webp" alt="Woodcutter vs Zombies"/><br/><b>Woodcutter vs Zombies</b><br/><sub>Roblox</sub></td>
</tr>
<tr>
<td><img src="public/media/grand-mall-batumi/home-desktop-en.webp" alt="Grand Mall Batumi"/><br/><b><a href="https://github.com/silestiari/grand-mall">Grand Mall Batumi</a></b><br/><sub>Web · released</sub></td>
<td><img src="public/media/sakhli/hero-desktop-ka.webp" alt="Sakhli"/><br/><b>Sakhli</b><br/><sub>Web · in development</sub></td>
<td><img src="public/media/sotka/home-dark.webp" alt="Sotka"/><br/><b>Sotka</b><br/><sub>ЕГЭ prep app · prototype</sub></td>
<td align="center"><a href="https://github.com/silestiari/3d-models"><b>🎨 33 free<br/>3D models →</b></a></td>
</tr>
</table>

## ✨ What's on the site

- 🐞 **Hero mini-game**: catch the bugs crawling over the hero by clicking them
- 🗂️ **Projects** with Web / Roblox / AI filters and a case page for each one: my role, stack, features, screenshots and videos
- 🧊 **3D Showroom**: Blender models from Build Your Own Pet in the browser; rotate, zoom, switch Wire / Clay / Final render passes. Falls back to static previews without WebGL
- 🐾 **Build a Pet**: a playable demo of the part-based pet system: mix parts, elements and accessories
- 🛤️ **About** as a journey path: every step is backed by a course, practice or a project
- 🧩 **Skills matrix**: skills are tied to the projects where they were used, not self-ratings
- 🌍 **EN / RU** with the language switch keeping the page and anchor, keyboard-friendly navigation, reduced-motion support

## 🧪 Quality

- **Playwright end-to-end tests** in [`e2e/`](e2e/): routing & SEO, i18n, navigation & contact, accessibility & layout (axe), 3D showroom, pet builder, playgrounds
- `check:i18n` script makes sure EN and RU have the same keys
- Test plan and QA report: [docs/TEST_PLAN.md](docs/TEST_PLAN.md) · [docs/QA_REPORT.md](docs/QA_REPORT.md)
- Architecture and performance notes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/PERFORMANCE_REPORT.md](docs/PERFORMANCE_REPORT.md)

## 🚀 Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run check:i18n` | Compare EN / RU dictionaries |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright end-to-end tests |

<p align="center">⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ &nbsp; =^･ω･^= &nbsp; ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆</p>

<div align="center">

🎀 Made by **[Sofia Stetsiuk](https://github.com/silestiari)** · [Telegram](https://t.me/silestiari) · [sofiavipera@gmail.com](mailto:sofiavipera@gmail.com)

<sub>All projects shown are personal or demo work, not commercial client orders.</sub>

</div>
