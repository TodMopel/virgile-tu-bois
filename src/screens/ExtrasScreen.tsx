import { useRef, useState } from "react";
import { extras } from "../data/extras";
import { KraftBackground, TapedCard, TornBanner, hashString } from "../ui/paper";
import { HiddenReveal } from "./HiddenReveal";
import { ExtrasLightbox } from "./ExtrasLightbox";

// Section "private jokes" — voir docs/adr/0004. Premier jet avec les vrais éléments
// fournis le 2026-08-11 (logo, vidéo, pochette verso) — les textes de crédits et les
// polaroids détourés restent à affiner, marqués "à personnaliser" ci-dessous.
export function ExtrasScreen() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <KraftBackground>
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
            <video
              src="./extras/behind-the-scenes.mp4"
              poster="./cover/front.jpeg"
              controls
              playsInline
              style={{ width: "100%", borderRadius: 6, display: "block", background: "#000" }}
            />
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", textAlign: "center", opacity: 0.7 }}>La vidéo originale</div>
          </TapedCard>

          <TapedCard id="pochette-verso" style={{ padding: "0.6rem" }}>
            <img
              src="./cover/back.png"
              alt="Pochette verso — Sables d'O-Zone"
              style={{ width: "100%", borderRadius: 6, display: "block" }}
            />
          </TapedCard>

          {/* Crédits — contenu à personnaliser, structure/style posés en attendant le texte définitif */}
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
              Les Coucous
              <br />
              [à personnaliser — noms]
              <br />
              <br />
              Cou Cou Records — 2024
              <br />
              <br />
              [à personnaliser — remerciements]
            </div>
          </TapedCard>

          {extras.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1.4rem" }}>
              {extras.map((item, i) => {
                // certaines photos prennent plus de place — pêle-mêle plutôt qu'une
                // grille uniforme, déterministe par id (stable entre les rendus).
                const big = hashString(item.id) % 6 === 0;
                return (
                  <TapedCard
                    key={item.id}
                    id={item.id}
                    rotationSpread={7}
                    onClick={() => setOpenIndex(i)}
                    style={big ? { gridColumn: "span 2", gridRow: "span 2" } : undefined}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.caption}
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          objectPosition: item.objectPosition ?? "center",
                          borderRadius: 6,
                          display: "block",
                          marginBottom: "2.6rem",
                        }}
                      />
                    )}
                    {item.caption && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>
                        {item.caption}
                      </div>
                    )}
                  </TapedCard>
                );
              })}
            </div>
          )}

          {openIndex !== null && (
            <ExtrasLightbox items={extras} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
          )}
        </div>
      </div>
      <HiddenReveal scrollRef={scrollRef} src="./extras/hidden-easter-egg.png" liftOffset={50} />
    </KraftBackground>
  );
}
