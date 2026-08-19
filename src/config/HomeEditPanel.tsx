import { EditPanelShell, editFieldStyles } from "./EditPanelShell";
import { exportConfigText, resetAllOverrides, resetHomeOverride, setHomeOverride, useEffectiveHomeOverride } from "./store";

const COVER_INTENSITY_MIN = 0;
const COVER_INTENSITY_MAX = 2.5;
const COVER_INTENSITY_STEP = 0.1;
const DEFAULT_BACKGROUND_COLOR = "#1c130b";

// Panneau d'édition de l'écran d'accueil (?edit) — scopé à l'écran Accueil (voir
// App.tsx), séparé du panneau Chansons (SongsEditPanel.tsx) et du mode édition d'Extras.
export function HomeEditPanel() {
  const override = useEffectiveHomeOverride();
  const { label: labelStyle, field: fieldStyle, button: buttonStyle } = editFieldStyles;

  return (
    <EditPanelShell label="Accueil">
      <label style={labelStyle}>
        Couleur de fond
        <input
          type="color"
          value={override.backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
          onChange={(e) => setHomeOverride({ backgroundColor: e.target.value })}
          style={{ ...fieldStyle, padding: "0.15rem", height: 34 }}
        />
      </label>

      <label style={labelStyle}>
        Intensité de l'animation de la pochette ({(override.coverIntensity ?? 1).toFixed(1)}×)
        <input
          type="range"
          min={COVER_INTENSITY_MIN}
          max={COVER_INTENSITY_MAX}
          step={COVER_INTENSITY_STEP}
          value={override.coverIntensity ?? 1}
          onChange={(e) => setHomeOverride({ coverIntensity: Number(e.target.value) })}
          style={{ accentColor: "#caa049" }}
        />
      </label>

      <button
        onClick={() => resetHomeOverride()}
        style={{ ...buttonStyle, background: "transparent", border: "1px solid #caa04988", color: "#faf3e2", width: "100%", marginBottom: "0.9rem" }}
      >
        Réinitialiser l'accueil
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
            if (confirm("Réinitialiser tous les réglages édités (accueil + toutes versions + crédits) ?")) resetAllOverrides();
          }}
          style={{ ...buttonStyle, background: "transparent", border: "1px solid #caa04988", color: "#faf3e2" }}
        >
          Tout réinitialiser
        </button>
      </div>

      <p style={{ opacity: 0.65, fontSize: "0.68rem", marginTop: "0.7rem", lineHeight: 1.5 }}>
        Les changements sont visibles seulement sur cet appareil (aperçu local) tant qu'ils ne sont pas collés dans le code. Le même export inclut aussi les réglages des chansons.
      </p>
    </EditPanelShell>
  );
}
