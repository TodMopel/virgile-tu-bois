import { useEffect, useRef, useState, type CSSProperties } from "react";
import { extras, type ExtraItem } from "../data/extras";
import { tracks } from "../data/tracks";
import { KraftBackground, TapedCard, TornBanner, hashString, paperPalette } from "../ui/paper";
import { HiddenReveal } from "./HiddenReveal";
import { ExtrasLightbox } from "./ExtrasLightbox";

type ExtraOverride = Partial<Pick<ExtraItem, "caption" | "objectPosition" | "zoom" | "fontFamily">>;

const EDIT_STORAGE_KEY = "extras-edit-overrides";

// Polices des 10 versions (voir data/tracks.ts, labelStyle.fontFamily) — reprises telles
// quelles pour que les légendes des extras piochent dans la même famille visuelle.
const TRACK_FONTS = [
  { label: "01 · Fredoka", value: "V01Fredoka, sans-serif" },
  { label: "02 · Baloo", value: "V02Baloo, sans-serif" },
  { label: "03 · Stencil", value: "V03Stencil, sans-serif" },
  { label: "04 · Audiowide", value: "V04Audiowide, sans-serif" },
  { label: "05 · Pacifico", value: "V05Pacifico, cursive" },
  { label: "06 · Share Tech Mono", value: "V06ShareTechMono, monospace" },
  { label: "07 · Anton", value: "V07Anton, sans-serif" },
  { label: "08 · Quicksand", value: "V08Quicksand, sans-serif" },
  { label: "09 · Marcellus", value: "V09Marcellus, serif" },
  { label: "10 · Cinzel", value: "V10Cinzel, serif" },
];

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

const roundButtonStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
  fontSize: "0.9rem",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const POSITION_STEP = 8;

// "50% 20%" -> {x:50,y:20} ; "center" (valeur par défaut) -> {x:50,y:50}
function parseObjectPosition(pos: string): { x: number; y: number } {
  const match = pos.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  if (!match) return { x: 50, y: 50 };
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
}

// Grille en lignes explicites (pas du CSS Grid pur) : nécessaire pour pouvoir aligner
// différemment chaque ligne incomplète (une seule petite photo isolée) — retour du
// 2026-08-11 ("toujours à gauche, j'aimerais qu'elles alternent"). `columns` est mesuré
// en JS pour rester responsive comme l'ancien `repeat(auto-fill, minmax(150px, 1fr))`.
const GRID_MIN_TILE = 150;
const GRID_GAP = 22.4; // ~1.4rem à 16px racine

interface GridEntry {
  item: ExtraItem;
  index: number;
  span: number;
}

function chunkRows(items: { item: ExtraItem; index: number; big: boolean }[], columns: number): GridEntry[][] {
  const rows: GridEntry[][] = [];
  let current: GridEntry[] = [];
  let width = 0;
  for (const { item, index, big } of items) {
    const span = Math.min(big ? 2 : 1, columns);
    if (width + span > columns && current.length > 0) {
      rows.push(current);
      current = [];
      width = 0;
    }
    current.push({ item, index, span });
    width += span;
  }
  if (current.length > 0) rows.push(current);
  return rows;
}

const ROW_ALIGN: NonNullable<CSSProperties["justifyContent"]>[] = ["center", "flex-start", "flex-end"];

// Mode édition caché (?edit dans l'URL) : glisser une photo pour la recadrer (objectPosition),
// éditer sa légende directement dans l'interface — retour du 2026-08-11 ("je modifie dans
// l'interface directement"). Les réglages sont gardés en localStorage le temps de la session
// puis exportés en texte prêt à coller dans extras.ts (pas de backend pour persister).
function useExtrasEditMode() {
  const [editMode] = useState(() => new URLSearchParams(window.location.search).has("edit"));
  const [overrides, setOverrides] = useState<Record<string, ExtraOverride>>(() => {
    try {
      const raw = localStorage.getItem(EDIT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!editMode) return;
    localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(overrides));
  }, [editMode, overrides]);

  const setOverride = (id: string, patch: ExtraOverride) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  return { editMode, overrides, setOverride };
}

function exportExtras(overrides: Record<string, ExtraOverride>) {
  const lines = extras.map((item) => {
    const o = overrides[item.id] ?? {};
    const caption = (o.caption ?? item.caption).replace(/"/g, '\\"');
    const objectPosition = o.objectPosition ?? item.objectPosition;
    const zoom = o.zoom ?? item.zoom;
    const fontFamily = o.fontFamily ?? item.fontFamily;
    const parts = [`id: "${item.id}"`, `caption: "${caption}"`];
    if (item.image) parts.push(`image: "${item.image}"`);
    if (objectPosition) parts.push(`objectPosition: "${objectPosition}"`);
    if (zoom && zoom !== 1) parts.push(`zoom: ${zoom.toFixed(2)}`);
    if (fontFamily) parts.push(`fontFamily: "${fontFamily}"`);
    return `  { ${parts.join(", ")} },`;
  });
  const text = lines.join("\n");
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Export copié — colle-le dans le chat, je le mets dans extras.ts."))
    .catch(() => alert("Impossible de copier automatiquement — voir la console."));
  // eslint-disable-next-line no-console
  console.log(text);
}

// Section "private jokes" — voir docs/adr/0004. Premier jet avec les vrais éléments
// fournis le 2026-08-11 (logo, vidéo, pochette verso) — les textes de crédits et les
// polaroids détourés restent à affiner, marqués "à personnaliser" ci-dessous.
export function ExtrasScreen() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { editMode, overrides, setOverride } = useExtrasEditMode();
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const compute = () => {
      setColumns(Math.max(1, Math.floor((el.clientWidth + GRID_GAP) / (GRID_MIN_TILE + GRID_GAP))));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nudgeZoom = (item: ExtraItem, delta: number) => {
    const current = overrides[item.id]?.zoom ?? item.zoom ?? 1;
    const next = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, current + delta));
    setOverride(item.id, { zoom: next });
  };

  // flèches plutôt que le drag au doigt : le drag ne panorait plus correctement une
  // fois zoomé (rect de l'image faussé par le transform:scale) — retour du 2026-08-11.
  const nudgePosition = (item: ExtraItem, dx: number, dy: number) => {
    const current = overrides[item.id]?.objectPosition ?? item.objectPosition ?? "50% 50%";
    const { x, y } = parseObjectPosition(current);
    const nx = Math.max(0, Math.min(100, x + dx));
    const ny = Math.max(0, Math.min(100, y + dy));
    setOverride(item.id, { objectPosition: `${nx.toFixed(0)}% ${ny.toFixed(0)}%` });
  };

  return (
    <KraftBackground>
      {editMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            background: "#221a10",
            color: "#faf3e2",
            padding: "0.6rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.78rem",
          }}
        >
          <span>Mode édition — glisse une photo pour la recadrer, tape pour éditer la légende</span>
          <button
            onClick={() => exportExtras(overrides)}
            style={{
              flexShrink: 0,
              border: "none",
              borderRadius: 999,
              padding: "0.4rem 0.9rem",
              background: paperPalette.gold,
              color: "#221a10",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            Copier l'export
          </button>
        </div>
      )}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          paddingBottom: "9.5rem",
        }}
      >
        <TornBanner title="Extras" />

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.4rem 1rem 0", display: "flex", flexDirection: "column", gap: "2.1rem" }}>
          <img
            src="./extras/logo-coucou-records.png"
            alt="Cou Cou Records"
            style={{ width: "42%", maxWidth: 160, margin: "0 auto", display: "block", transform: "rotate(-3deg)" }}
          />

          <TapedCard id="video-bts" style={{ padding: "0.6rem" }}>
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", textAlign: "center", opacity: 0.7 }}>La vidéo originale</div>
            <div style={{height: "2rem" }}></div>
            <video
              src="./extras/behind-the-scenes.mp4"
              poster="./cover/front.jpeg"
              controls
              playsInline
              style={{ width: "100%", borderRadius: 6, display: "block", background: "#000" }}
            />
          </TapedCard>

          <TapedCard id="tracklist">
            <div
              style={{
                fontFamily: "V10Cinzel, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                textAlign: "center",
                marginBottom: "0.8rem",
              }}
            >
              Tracklist
            </div>
            {/* conteneur centré, largeur auto (pas 100%) : le contenu à l'intérieur est
                ferré à gauche plutôt que chaque ligne centrée indépendamment — sinon les
                numéros ne s'alignent pas puisque chaque police fait une largeur différente */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.45rem" }}>
                {tracks.map((track) => (
                  <div key={track.id} style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                    <span style={{ fontSize: "0.75rem", opacity: 0.55, minWidth: 18, textAlign: "right" }}>
                      {String(track.number).padStart(2, "0")}
                    </span>
                    {/* les 10 traitements typographiques du titre, comme sur la pochette
                        verso — la couleur de labelStyle est calée pour les fonds sombres
                        des visuels, illisible sur la carte crème, donc on ne reprend que
                        la police */}
                    <span style={{ fontFamily: TRACK_FONTS[0].label, color: paperPalette.ink, fontSize: "1rem", fontWeight: 600 }}>
                      Virgile tu bois
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TapedCard>

          {extras.length > 0 && (
            <div ref={gridRef} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {(() => {
                // certaines photos prennent plus de place — pêle-mêle plutôt qu'une
                // grille uniforme, déterministe par id (stable entre les rendus).
                const gridItems = extras.map((item, index) => ({ item, index, big: hashString(item.id) % 6 === 0 }));
                const rows = chunkRows(gridItems, columns);
                let underfullCount = 0;
                return rows.map((row, rowIndex) => {
                  const rowSpan = row.reduce((sum, entry) => sum + entry.span, 0);
                  // ligne incomplète (ex. une seule petite photo isolée) : alterne son
                  // alignement plutôt que de toujours coller à gauche — retour du 2026-08-11.
                  const justifyContent = rowSpan < columns ? ROW_ALIGN[underfullCount++ % ROW_ALIGN.length] : "flex-start";
                  return (
                    <div key={rowIndex} style={{ display: "flex", gap: "1.4rem", justifyContent }}>
                      {row.map(({ item, index, span }) => {
                        const o = overrides[item.id];
                        const caption = o?.caption ?? item.caption;
                        const objectPosition = o?.objectPosition ?? item.objectPosition ?? "center";
                        const zoom = o?.zoom ?? item.zoom ?? 1;
                        const fontFamily = o?.fontFamily ?? item.fontFamily;
                        const width = `calc((100% - ${(columns - 1) * GRID_GAP}px) / ${columns} * ${span} + ${(span - 1) * GRID_GAP}px)`;
                        return (
                          <div key={item.id} style={{ width, flexShrink: 0 }}>
                            <TapedCard
                              id={item.id}
                              rotationSpread={7}
                              onClick={editMode ? undefined : () => setOpenIndex(index)}
                            >
                              {item.image && (
                                <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 6, marginBottom: "2.6rem" }}>
                                  <img
                                    src={item.image}
                                    alt={caption}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      objectPosition,
                                      display: "block",
                                      transform: `scale(${zoom})`,
                                      // zoome depuis le point de recadrage actuel, pas depuis le centre
                                      // de la case — sinon le zoom "retire" ce qu'on vient de cadrer sur
                                      // un bord et les bords redeviennent inatteignables.
                                      transformOrigin: objectPosition,
                                    }}
                                  />
                                  {editMode && (
                                    <>
                                      {/* flèches de recadrage — remplacent le drag au doigt, cassé une
                                          fois zoomé (le rect de l'image change avec transform:scale) */}
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          position: "absolute",
                                          bottom: 4,
                                          left: 4,
                                          display: "grid",
                                          gridTemplateColumns: "repeat(3, 24px)",
                                          gridTemplateRows: "repeat(2, 24px)",
                                          gap: 2,
                                        }}
                                      >
                                        <div />
                                        <button onClick={() => nudgePosition(item, 0, -POSITION_STEP)} style={roundButtonStyle}>
                                          ↑
                                        </button>
                                        <div />
                                        <button onClick={() => nudgePosition(item, -POSITION_STEP, 0)} style={roundButtonStyle}>
                                          ←
                                        </button>
                                        <button onClick={() => nudgePosition(item, 0, POSITION_STEP)} style={roundButtonStyle}>
                                          ↓
                                        </button>
                                        <button onClick={() => nudgePosition(item, POSITION_STEP, 0)} style={roundButtonStyle}>
                                          →
                                        </button>
                                      </div>
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ position: "absolute", bottom: 4, right: 4, display: "flex", gap: 4 }}
                                      >
                                        <button onClick={() => nudgeZoom(item, -ZOOM_STEP)} style={roundButtonStyle}>
                                          −
                                        </button>
                                        <button onClick={() => nudgeZoom(item, ZOOM_STEP)} style={roundButtonStyle}>
                                          +
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {editMode ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                  {/* aperçu en direct de la police choisie — retour du 2026-08-11
                                      ("voir au dessus le texte avec la police qu'on écrit") */}
                                  <div
                                    style={{
                                      fontFamily,
                                      fontSize: "0.9rem",
                                      fontWeight: 600,
                                      textAlign: "center",
                                      color: paperPalette.ink,
                                      minHeight: "1.2em",
                                    }}
                                  >
                                    {caption || "légende…"}
                                  </div>
                                  <input
                                    value={caption}
                                    onChange={(e) => setOverride(item.id, { caption: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="légende…"
                                    style={{
                                      width: "100%",
                                      fontSize: "0.8rem",
                                      textAlign: "center",
                                      border: `1px solid ${paperPalette.gold}`,
                                      borderRadius: 6,
                                      padding: "0.3rem",
                                      background: "#fff",
                                      color: paperPalette.ink,
                                    }}
                                  />
                                  <select
                                    value={fontFamily ?? ""}
                                    onChange={(e) => setOverride(item.id, { fontFamily: e.target.value || undefined })}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      width: "100%",
                                      fontSize: "0.72rem",
                                      border: `1px solid ${paperPalette.gold}`,
                                      borderRadius: 6,
                                      padding: "0.25rem",
                                      background: "#fff",
                                      color: paperPalette.ink,
                                    }}
                                  >
                                    <option value="">Police par défaut</option>
                                    {TRACK_FONTS.map((f) => (
                                      <option key={f.value} value={f.value}>
                                        {f.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                item.caption && (
                                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center", fontFamily }}>
                                    {item.caption}
                                  </div>
                                )
                              )}
                            </TapedCard>
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()}
            </div>
          )}

          <TapedCard id="credits">
            <div
              style={{
                fontFamily: "V10Cinzel, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                textAlign: "center",
                marginBottom: "0.6rem",
              }}
            >
              Crédits
            </div>
            <div style={{ fontSize: "0.85rem", textAlign: "center", lineHeight: 1.7, opacity: 0.85 }}>
              Scott
              <br />
              Agathe
            </div>
            <div style={{ height: 1, background: paperPalette.gold, opacity: 0.4, width: "60%", margin: "0.9rem auto" }} />
            <div style={{ fontSize: "0.85rem", textAlign: "center", lineHeight: 1.7, opacity: 0.85 }}>
              <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Les Coucous</div>
              Karlito
              <br />
              Remi
              <br />
              Virgile
            </div>
            <div style={{ fontSize: "0.85rem", textAlign: "center", lineHeight: 1.7, opacity: 0.85, marginTop: "0.9rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Remerciments</div>
              Karlito
              <br />
              Agathe
              <br />
              Remi
              <br />
              Maelle
              <br />
              Quentin
              <br />
              Manon
              <br />
              Pio
              <br />
              Eliot
              <br />
              Tiphaine
            </div>
            <div style={{ fontSize: "0.85rem", textAlign: "center", lineHeight: 1.7, opacity: 0.85, marginTop: "0.9rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Extra remerciments</div>
              La bonhumeur de Rémi
              <br />
              La persévérance de Karl
              <br />
              La sagesse de Maelle
              <br />
              La voix d'Agathe
              <br />
              Le "menteur" de Quentin
              <br />
              La présence de Virgile
            </div>
            <div style={{ fontSize: "0.8rem", fontStyle: "italic", textAlign: "center", opacity: 0.75, marginTop: "1rem" }}>
              Merci à Karl de prononcer cette phrase avec autant d'énergie
            </div>
            <div
              style={{
                fontFamily: "V05Pacifico, cursive",
                fontSize: "1.3rem",
                textAlign: "center",
                marginTop: "0.6rem",
                color: paperPalette.pinkDark,
              }}
            >
              Virgile tu bois
            </div>
          </TapedCard>
            <div
              style={{
                height: "3.3rem",
              }}
            >
            </div>
          {openIndex !== null && (
            <ExtrasLightbox items={extras} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
          )}
        </div>
      </div>
      <HiddenReveal scrollRef={scrollRef} src="./extras/hidden-easter-egg.png" liftOffset={80} />
    </KraftBackground>
  );
}
