/** Intake-modellen enligt spec 1.2. Ingen personuppgift utöver e-post. */

export type Atgard =
  | "tillbyggnad"
  | "fristaende"
  | "altan"
  | "plank"
  | "fasadandring"
  | "pool"
  | "annat";

export type Placering = "fast" | "fristaende" | "oklart";

export type Fastighetstyp = "villa" | "flerbostad" | "fritidshus" | "annat";

/** Tre-läges-svar. "vetej" behandlas alltid konservativt. */
export type JaNejVetEj = "ja" | "nej" | "vetej";

export interface Intake {
  atgard: Atgard;
  placering: Placering | null;
  /** m², en decimal. null när ren fasadändring utan volym. */
  yta: number | null;
  /** Taknock för byggnad; för plank/mur höjd från lägsta marknivå på utsidan. */
  hojd: number | null;
  /** Endast plank/mur. */
  langd: number | null;
  /** m till närmaste tomtgräns. null = "vet ej". */
  avstandTomtgrans: number | null;
  fastighetstyp: Fastighetstyp;
  kommun: string;
  /** Frivillig. Skrivs bara i underlaget, aldrig i loggen. */
  fastighetsbeteckning: string;
  detaljplan: JaNejVetEj;
  naraVatten: JaNejVetEj;
  kulturSamfallighet: JaNejVetEj;
  befintligaKomplement: JaNejVetEj;
  /** m². null = "vet ej" eller inga befintliga. */
  befintligKomplementYta: number | null;
  installation: JaNejVetEj;
  fritext: string;
  epost: string;
}

export type Utfall = "A" | "B" | "C";

export type Klassning =
  | "tillbyggnad"
  | "komplementbyggnad"
  | "plank_mur"
  | "fasadandring"
  | "anlaggning"
  | "tvetydig"
  | "ingen";

/** En triageorsak. `kod` är B1–B16 eller C1–C5; `text` är spec-copyn. */
export interface Orsak {
  kod: string;
  text: string;
}

export interface TriageResultat {
  outcome: Utfall;
  reasons: Orsak[];
  classification: Klassning;
  /** Mall-id som låses före Checkout. null vid B och C. */
  regelspar: string | null;
  flags: string[];
  rulesVersion: string;
}
