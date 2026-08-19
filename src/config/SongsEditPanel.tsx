import { useEffect, useState } from "react";
import { tracks } from "../data/tracks";
import { usePlaybackContext } from "../audio/PlaybackContext";
import { TRACK_FONTS } from "./fonts";
import { TRACK_CUSTOM_FIELDS } from "./trackFields";
import { EditPanelShell, editFieldStyles } from "./EditPanelShell";
import {
  exportConfigText,
  resetAllOverrides,
  resetTrackOverride,
  setTrackCustomField,
  setTrackOverride,
  useEffectiveTrackOverride,
} from "./store";

const INTENSITY_MIN = 0.4;
const INTENSITY_MAX = 2.5;
const INTENSITY_STEP = 0.1;

// Composées à partir de deux couleurs choisies dans le panneau — un raccourci pour ne
// pas avoir à taper du CSS à la main ; le champ texte juste en dessous reste éditable
// librement pour un dégradé plus fin (plusieurs teintes, angle différent...).
function twoStopGradient(c1: string, c2: string): string {
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

// Les champs "nombre de..." (step=1) s'affichent en entier plutôt qu'avec ".0".
function formatFieldValue(value: number, step: number): string {
  return Number.isInteger(step) ? String(Math.round(value)) : value.toFixed(1);
}

// Panneau d'édition des chansons (?edit) — scopé aux écrans Sélection et Lecture (voir
// App.tsx), séparé du mode édition d'Extras (photos/crédits, resté inchangé dans
// ExtrasScreen.tsx) et du panneau Accueil (HomeEditPanel.tsx). Par version : couleur
// d'accent, fond animé, police du titre, intensité audio, plus un réglage spécifique à
// la version (voir trackFields.ts).
export function SongsEditPanel() {
  const { currentTrack } = usePlaybackContext();
  const [trackId, setTrackId] = useState(() => currentTrack?.id ?? tracks[0].id);

  // Le panneau reste monté en permanence sur Sélection/Lecture (voir App.tsx), donc
  // l'initialiseur ci-dessus ne capture que le morceau en cours à l'ouverture de
  // l'app (souvent aucun) — sans ça, choisir un morceau après coup n'y ferait pas
  // suivre le sélecteur. Se resynchronise à chaque nouveau morceau lancé, tout en
  // laissant un choix manuel dans le sélecteur tenir jusqu'au morceau suivant.
  useEffect(() => {
    if (currentTrack) setTrackId(currentTrack.id);
  }, [currentTrack?.id]);

  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const override = useEffectiveTrackOverride(track.id);
  const customFields = TRACK_CUSTOM_FIELDS[track.id] ?? [];

  const [gradA, setGradA] = useState("#202020");
  const [gradB, setGradB] = useState("#606060");

  const { label: labelStyle, field: fieldStyle, button: buttonStyle } = editFieldStyles;

  return (
    <EditPanelShell label="Chansons" side="right">
      <label style={labelStyle}>
        Version
        <select value={trackId} onChange={(e) => setTrackId(e.target.value)} style={fieldStyle}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {String(t.number).padStart(2, "0")} · {t.style}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Couleur d'accent
        <input
          type="color"
          value={override.accentColor ?? track.swatch}
          onChange={(e) => setTrackOverride(track.id, { accentColor: e.target.value })}
          style={{ ...fieldStyle, padding: "0.15rem", height: 34 }}
        />
      </label>

      <label style={labelStyle}>
        Fond animé (CSS)
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <input type="color" value={gradA} onChange={(e) => setGradA(e.target.value)} style={{ ...fieldStyle, padding: "0.15rem", width: 44, flexShrink: 0 }} />
          <input type="color" value={gradB} onChange={(e) => setGradB(e.target.value)} style={{ ...fieldStyle, padding: "0.15rem", width: 44, flexShrink: 0 }} />
          <button
            onClick={() => setTrackOverride(track.id, { background: twoStopGradient(gradA, gradB) })}
            style={{ ...buttonStyle, background: "#caa049", color: "#221a10", flex: 1 }}
          >
            Générer le dégradé
          </button>
        </div>
        <input
          value={override.background ?? ""}
          onChange={(e) => setTrackOverride(track.id, { background: e.target.value })}
          placeholder="ex. linear-gradient(135deg, #202020, #606060)"
          style={fieldStyle}
        />
      </label>

      <label style={labelStyle}>
        Police du titre
        <select
          value={override.titleFontFamily ?? track.labelStyle.fontFamily ?? ""}
          onChange={(e) => setTrackOverride(track.id, { titleFontFamily: e.target.value })}
          style={fieldStyle}
        >
          {TRACK_FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Intensité de l'animation ({(override.intensity ?? 1).toFixed(1)}×)
        <input
          type="range"
          min={INTENSITY_MIN}
          max={INTENSITY_MAX}
          step={INTENSITY_STEP}
          value={override.intensity ?? 1}
          onChange={(e) => setTrackOverride(track.id, { intensity: Number(e.target.value) })}
          style={{ accentColor: "#caa049" }}
        />
      </label>

      {customFields.map((customField) => (
        <label key={customField.key} style={labelStyle}>
          {customField.label} ({formatFieldValue(override.custom?.[customField.key] ?? customField.default, customField.step)})
          <input
            type="range"
            min={customField.min}
            max={customField.max}
            step={customField.step}
            value={override.custom?.[customField.key] ?? customField.default}
            onChange={(e) => setTrackCustomField(track.id, customField.key, Number(e.target.value))}
            style={{ accentColor: "#caa049" }}
          />
        </label>
      ))}

      <button
        onClick={() => resetTrackOverride(track.id)}
        style={{ ...buttonStyle, background: "transparent", border: "1px solid #caa04988", color: "#faf3e2", width: "100%", marginBottom: "0.9rem" }}
      >
        Réinitialiser cette version
      </button>

      <div style={{ height: 1, background: "#caa04944", margin: "0.2rem 0 0.9rem" }} />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => {
            const text = exportConfigText();
            navigator.clipboard
              .writeText(text)
              .then(() => alert("Config copiée — colle-la dans src/data/siteConfig.defaults.ts (remplace le contenu de l'objet exporté), puis commit + push pour la rendre permanente."))
              .catch(() => alert("Impossible de copier automatiquement — voir la console."));
            // eslint-disable-next-line no-console
            console.log(text);
          }}
          style={{ ...buttonStyle, background: "#caa049", color: "#221a10", flex: 1 }}
        >
          Copier la config
        </button>
        <button
          onClick={() => {
            if (confirm("Réinitialiser tous les réglages édités (toutes versions + accueil + crédits) ?")) resetAllOverrides();
          }}
          style={{ ...buttonStyle, background: "transparent", border: "1px solid #caa04988", color: "#faf3e2" }}
        >
          Tout réinitialiser
        </button>
      </div>

      <p style={{ opacity: 0.65, fontSize: "0.68rem", marginTop: "0.7rem", lineHeight: 1.5 }}>
        Les changements sont visibles seulement sur cet appareil (aperçu local) tant qu'ils ne sont pas collés dans le code.
      </p>
    </EditPanelShell>
  );
}
