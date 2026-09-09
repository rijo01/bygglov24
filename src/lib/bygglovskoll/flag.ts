/**
 * Feature-flagga för Bygglovskoll.
 *
 * Av som standard: allt utom ett uttryckligt "true" stänger tjänsten. Så kan
 * Preview köra med flaggan på medan Production har den av — varje deployment
 * byggs med sin egen miljö, och sidorna 404:ar redan vid prerendering i den
 * miljö där flaggan är av.
 *
 * Läses bara på servern. Klientkomponenter (Header) får värdet som prop.
 */
export function bygglovskollAktiv(): boolean {
  return process.env.BYGGLOVSKOLL_ENABLED === "true";
}
