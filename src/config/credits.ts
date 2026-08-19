// Texte des crédits (page Extras), éditable depuis le panneau d'édition (?edit).
// Format volontairement simple pour rester éditable dans un <textarea> :
// - un saut de ligne vide sépare deux paragraphes
// - une première ligne "## Titre" fait de "Titre" un intitulé de section en gras
// - un paragraphe d'une seule ligne entourée d'astérisques ("*...*") s'affiche en italique
// Le "Virgile tu bois" rose en signature, en bas de la carte, reste fixe (habillage de
// marque, pas du texte de crédits) — voir ExtrasScreen.tsx.
export const DEFAULT_CREDITS_TEXT = `Scott
Agat

## Les Coucous
Karlito
Rémy le grain de riz vinaigré
Le V

## Remerciments
Karl
Agathe
Rémy
Malek
Quentin
Manon
Pio
Eliot
Tiphaine

## Extra remerciments
La bonhumeur de Rémy
La persévérance de Karl
La sagesse de Maelle
La voix d'Agathe
Le "menteur" de Quentin
La "présence" de Virgile

*Merci à Karl d'avoir prononcer cette phrase avec autant d'énergie*`;

export interface CreditsParagraph {
  heading?: string;
  lines: string[];
  italic: boolean;
}

export function parseCreditsText(text: string): CreditsParagraph[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const rawLines = block.split("\n").map((l) => l.trim());
      let heading: string | undefined;
      let lines = rawLines;
      if (rawLines[0]?.startsWith("## ")) {
        heading = rawLines[0].slice(3).trim();
        lines = rawLines.slice(1);
      }
      let italic = false;
      if (lines.length === 1 && lines[0].length > 1 && lines[0].startsWith("*") && lines[0].endsWith("*")) {
        italic = true;
        lines = [lines[0].slice(1, -1)];
      }
      return { heading, lines, italic };
    });
}
