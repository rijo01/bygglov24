/**
 * Web3Forms är sajtens enda väg för inkommande mejl. Nyckeln är publik till sin
 * natur — den ligger redan i klientbundlen via LeadForm — och pekar på
 * info@bygglov24.se. Samlad här så att det finns ett ställe att byta den på.
 */
export const WEB3FORMS_ACCESS_KEY = "c666ec4f-ba04-4e5b-9403-31d6accf8dd8";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface Web3FormsBrev {
  subject: string;
  from_name: string;
  /** Svarsadress. Sätts till kundens e-post så att ett svar går rätt. */
  email: string;
  message: string;
}

/** Skickar ett brev. Returnerar false i stället för att kasta. */
export async function skickaWeb3Forms(brev: Web3FormsBrev): Promise<boolean> {
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...brev }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
