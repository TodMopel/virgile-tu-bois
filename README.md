# Virgile Tu Bois — app USB (Les Coucous / Sables d'O-Zone)

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

## Déploiement sur la clé USB

### iPhone (Safari)
Copier tout le contenu de `dist/` (après `npm run build`) à la racine de la clé.
Ouvrir `index.html` directement dans Safari depuis l'app Fichiers.

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

L'APK généré (`android/app/build/outputs/apk/debug/app-debug.apk`) est à copier sur la clé.

### Fallback PWA (GitHub Pages)

En complément de la clé, une version hébergée existe pour contourner les restrictions `file://` de Safari iOS (voir `../CONTEXT.md`, section "Fallback PWA") :

```
npm run build:pwa   # PAS npm run build — config séparée (vite.config.pwa.ts), sans singlefile
```

Déploiement automatique via GitHub Actions à chaque push sur `main` — pas besoin de lancer ce build manuellement pour publier. URL live : https://todmopel.github.io/virgile-tu-bois/

Côté utilisateur : ouvrir le lien dans Safari, puis Partager → "Sur l'écran d'accueil". Fonctionne hors-ligne ensuite (service worker qui précache tout, audio compris).

## Ce qui manque encore

- **Effets sonores d'interface** (`public/sfx/nav-click.mp3`, `select.mp3`, `transition.mp3`) : pas de fichiers pour l'instant, l'app fonctionne sans (silencieux) — voir `useSfx.ts`, échoue silencieusement si absent
- **Extras / private jokes** (`src/data/extras.ts`) : structure prête, contenu vide
- **APK final** : à générer sur une machine avec Android Studio (voir ci-dessus)
