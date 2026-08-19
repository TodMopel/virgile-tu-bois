# Sables d'O-Zone — app USB (Les Coucous)

Voir `../CONTEXT.md` et `../docs/` pour le contexte complet et les décisions (ADR).

## Développement

```
npm install
npm run dev          # serveur de dev local
npm run build         # build de prod dans dist/
```

## Analyse audio (à relancer si les mp3 changent)

```
npm run analyze-audio  # ffmpeg + FFT maison → src/data/analysis/*.json (bundlé, pas fetché)
```

## Déploiement : PWA sur GitHub Pages

Depuis le 2026-08-18, c'est le seul mode de diffusion poursuivi (la clé USB et l'APK Android sont abandonnés, voir plus bas).

```
npm run build:pwa   # PAS npm run build — config séparée (vite.config.pwa.ts), sans singlefile
```

Déploiement automatique via GitHub Actions à chaque push sur `main` — pas besoin de lancer ce build manuellement pour publier. URL live : https://todmopel.github.io/virgile-tu-bois/

Côté utilisateur : ouvrir le lien dans Safari, puis Partager → "Sur l'écran d'accueil". Fonctionne hors-ligne ensuite (service worker qui précache tout, audio compris).

## Panneau d'édition en direct (`?edit`)

Ajouter `?edit` à l'URL (ex. `https://todmopel.github.io/virgile-tu-bois/?edit`) active trois workflows d'édition séparés, chacun visible seulement sur son écran :

- **Extras** (bandeau en haut de la page) : recadrage/légende/police par photo, texte des crédits.
- **Accueil** (bouton "⚙ Accueil", en haut à gauche) : couleur de fond, intensité de l'animation de la pochette.
- **Chansons** (bouton "⚙ Chansons", en haut à droite — visible sur Sélection et Lecture) : par version, couleur d'accent, dégradé de fond, police du titre, intensité de l'animation, plus un réglage spécifique à chaque version (voir `src/config/trackFields.ts` — nombre de danseurs, d'étincelles, de particules...).

Les changements sont sauvegardés dans le navigateur (localStorage) pour prévisualiser — ils ne sont visibles que par la personne qui édite tant qu'ils ne sont pas copiés dans le code (bouton "Copier la config", présent dans les panneaux Accueil et Chansons → coller dans `src/data/siteConfig.defaults.ts`, committer, push : le redeploy GitHub Actions les rend permanents pour tout le monde). Ce fichier peut aussi être édité directement depuis l'interface web de GitHub (icône crayon), sans avoir besoin d'un environnement de dev local. Les crédits/photos d'Extras suivent leur propre export ("Copier l'export" dans le bandeau Extras → `src/data/extras.ts`).

## Ce qui manque encore

- **Effets sonores d'interface** (`public/sfx/nav-click.mp3`, `select.mp3`, `transition.mp3`) : pas de fichiers pour l'instant, l'app fonctionne sans (silencieux) — voir `useSfx.ts`, échoue silencieusement si absent
- **Extras / private jokes** (`src/data/extras.ts`) : structure prête, contenu vide

## Abandonné (2026-08-18) : clé USB et APK Android

Le projet visait à l'origine une clé USB (PC + iPhone via `file://`) et un APK Android (Capacitor). Cette piste est abandonnée au profit de la seule PWA hébergée ci-dessus — voir `../CONTEXT.md` pour le détail. Le code correspondant (`android/`, `vite.config.ts` singlefile, `scripts/strip-module-script.mjs`) reste dans le dépôt mais n'est plus maintenu activement :

<details>
<summary>Anciennes instructions (clé USB / APK) — non maintenues</summary>

### iPhone (Safari, depuis une clé USB)
Copier tout le contenu de `dist/` (après `npm run build`) à la racine de la clé.
Ouvrir `index.html` directement dans Safari depuis l'app Fichiers. (Échouait sur iPad, cause non identifiée — voir CONTEXT.md — c'est ce qui a motivé le passage à la PWA.)

### Android (.apk)
Ce dépôt n'a pas de JDK/Android SDK installé, donc l'APK n'a pas pu être généré ici.
Sur une machine avec Android Studio :

```
npm run build
npx cap sync android
npx cap open android      # ouvre le projet dans Android Studio
```

Puis dans Android Studio : Build → Build Bundle(s)/APK(s) → Build APK(s).
Ou en ligne de commande (JDK 17+ requis) :

```
cd android && ./gradlew assembleDebug
```

</details>
