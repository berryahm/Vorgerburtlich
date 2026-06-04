/* ============================================================
   Express Vorgeburtlich: script.js
   CONFIG · i18n · Validierung · Submit · UI-Verhalten
   Vanilla JS, kein Framework, kein Build-Step.
   ============================================================ */

/* ============================================================
   1) CONFIG: ALLE austauschbaren Werte an einem Ort
   ============================================================ */
const CONFIG = {
  formEndpoint: "https://api.web3forms.com/submit",   // Web3Forms
  web3formsKey: "d5a46f99-103c-4963-9f98-6e6a2f3a9c83", // Web3Forms Access Key (Pflicht)
  calendlyUrl:  "REPLACE_CALENDLY_URL",    // leer lassen, um Button zu verbergen
  whatsappUrl:  "REPLACE_WHATSAPP_URL",    // https://wa.me/41XXXXXXXXX
  phone:        "REPLACE_PHONE",
  email:        "REPLACE_EMAIL",
  privacyUrl:   "REPLACE_PRIVACY_URL",
  imprintUrl:   "REPLACE_IMPRINT_URL",
  metaPixelId:  "",                        // leer = Pixel deaktiviert; laedt NUR bei Marketing-Einwilligung
  gaMeasurementId: "",                     // z. B. "G-XXXXXXX"; leer = aus; laedt NUR bei Statistik-Einwilligung
  defaultLang:  "de",

  /* Teil-Lead-Capturing (Nachfassen bei Abbruch im Wizard).
     Autosave/Resume im Browser ist IMMER aktiv (rein clientseitig, kein Versand).
     Das Senden von Teil-Leads an den Server ist standardmässig AUS:
     erst aktivieren, wenn Endpoint UND Rechtsgrundlage/Einwilligung (revDSG)
     für die Kontaktaufnahme bei abgebrochenen Eingaben geklärt sind. */
  partialCapture:  false,                  // true = Teil-Leads serverseitig erfassen
  partialEndpoint: "",                     // optional eigener Endpoint, sonst formEndpoint

  /* Tracking-Hook: feuert bei erfolgreichem Lead.
     Standardmaessig No-Op. Hier Meta-Pixel-Event ergaenzen. */
  onLeadSuccess: function () {
    // Beispiel (nur aktiv, wenn Pixel eingebunden & metaPixelId gesetzt):
    // if (typeof fbq === "function") {
    //   fbq("track", "Lead");
    //   fbq("track", "CompleteRegistration");
    // }
  }
};

/* ============================================================
   2) i18n: datengetrieben (DE vollständig, EN/FR/IT Kerntexte)
   ============================================================ */
const I18N = {
  /* ---------------- DEUTSCH ---------------- */
  de: {
    "meta.title": "Express Vorgeburtlich: Krankenkassenanmeldung fürs Baby",
    "meta.description": "Kostenlose, unverbindliche Beratung zur vorgeburtlichen Krankenkassenanmeldung fürs Baby. Schweizer Beratung, einfach & rechtzeitig erledigt.",
    "meta.ogTitle": "Krankenkassenanmeldung fürs Baby: einfach & rechtzeitig",
    "meta.ogDescription": "Kostenlose, unverbindliche Beratung zur vorgeburtlichen Anmeldung deines Babys. Als Dankeschön ein Babyphone bei erfolgreicher Anmeldung.",

    "nav.process": "So funktioniert's",
    "nav.benefits": "Vorteile",
    "nav.faq": "FAQ",
    "nav.cta": "Jetzt anmelden",

    "hero.eyebrow": "Vorgeburtliche Krankenkassenanmeldung",
    "hero.title": "Die Anmeldung fürs Baby: einfach & rechtzeitig erledigt",
    "hero.sub": "Wir begleiten dich kostenlos und unverbindlich durch die vorgeburtliche Anmeldung deines Babys. Persönlich, in der Schweiz, ohne komplizierte Recherche.",
    "hero.cta": "Jetzt kostenlos anmelden",
    "hero.ctaSecondary": "So funktioniert's",
    "hero.giftNote": "Babyphone (CHF 149) als Dankeschön bei erfolgreicher Anmeldung*",
    "hero.urgency": "Wichtig: Nach der Geburt droht bei einem Leiden die Ablehnung der Zusatzversicherung.",

    "trust.free": "Kostenlos & unverbindlich",
    "trust.swiss": "Schweizer Beratung",
    "trust.parents": "Für werdende Eltern",
    "trust.noRisk": "Ohne Risikoprüfung, auch bei Geburtsgebrechen",

    "strip.free": "Kostenlos & unverbindlich",
    "strip.swiss": "Persönliche Schweizer Beratung",
    "strip.data": "Daten vertraulich behandelt",
    "strip.fast": "Schnelle Rückmeldung",

    "form.title": "In 2 Minuten unverbindlich starten",
    "form.lead": "Trag dich ein, wir melden uns telefonisch oder per E-Mail. Keine Verpflichtung.",
    "form.firstName": "Vorname *",
    "form.lastName": "Nachname *",
    "form.phone": "Telefonnummer *",
    "form.phonePlaceholder": "+41 79 123 45 67",
    "form.email": "E-Mail *",
    "form.zip": "PLZ *",
    "form.dueDate": "Errechneter Geburtstermin *",
    "form.address": "Adresse (optional)",
    "form.addressPlaceholder": "Strasse & Nr.",
    "form.privacy": "Ich akzeptiere die",
    "form.privacyLink": "Datenschutzerklärung",
    "form.privacyStar": ". *",
    "form.keepInsurer": "Ich möchte die Anmeldung bei meiner aktuellen Krankenkasse.",
    "form.insurer": "Aktuelle Krankenkasse",
    "form.insurerPlaceholder": "Bitte wählen …",
    "form.insurerOther": "Andere",
    "form.insurerNote": "Wir berücksichtigen deinen Wunsch gerne und melden dein Baby bei deiner aktuellen Krankenkasse an.",
    "form.submit": "Unverbindlich anfragen",
    "form.microcopy": "Wir melden uns telefonisch oder per E-Mail. Keine Verpflichtung.",

    "err.required": "Bitte fülle dieses Feld aus.",
    "err.firstName": "Bitte gib deinen Vornamen ein.",
    "err.lastName": "Bitte gib deinen Nachnamen ein.",
    "err.phone": "Bitte gib eine gültige Schweizer Telefonnummer ein (z. B. +41 79 123 45 67 oder 079 123 45 67).",
    "err.email": "Bitte gib eine gültige E-Mail-Adresse ein.",
    "err.zip": "Bitte gib eine gültige PLZ ein (genau 4 Ziffern).",
    "err.dueDate": "Bitte gib den errechneten Geburtstermin an.",
    "err.dueDatePast": "Der Termin sollte in der Zukunft liegen. Bitte prüfe das Datum.",
    "err.privacy": "Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.",

    "success.title": "Danke, wir haben deine Anfrage erhalten!",
    "success.text": "Wir melden uns in Kürze bei dir. Du kannst auch direkt einen Termin buchen.",
    "success.calendly": "Beratungstermin direkt buchen",
    "status.error": "Etwas ist schiefgelaufen. Bitte versuch es nochmals oder kontaktiere uns direkt.",

    "problem.eyebrow": "Die häufigsten Unsicherheiten",
    "problem.title": "Kennst du diese Fragen?",
    "problem.lead": "Rund um die Geburt gibt es viel zu organisieren. Bei der Krankenkasse fürs Baby tauchen schnell Unsicherheiten auf.",
    "problem.q1": "Welche Krankenkasse passt zu unserem Baby?",
    "problem.q2": "Brauchen wir eine Zusatzversicherung, und welche?",
    "problem.q3": "Was muss vor der Geburt erledigt sein?",
    "problem.q4": "Was, wenn das Baby schon da ist?",

    "solution.eyebrow": "So unterstützen wir dich",
    "solution.title": "Wir führen dich sauber durch den Prozess",
    "solution.lead": "Du musst nicht alles selbst recherchieren. Wir erklären dir verständlich, was wann zu tun ist, und begleiten die Anmeldung deines Babys rechtzeitig und persönlich.",
    "solution.p1": "Verständliche Erklärung, ohne Fachjargon",
    "solution.p2": "Rechtzeitig vor der Geburt erledigt",
    "solution.p3": "Persönliche Beratung aus der Schweiz",
    "solution.cta": "Jetzt kostenlos anmelden",

    "gift.badge": "Unser Dankeschön",
    "gift.title": "Ein Babyphone im Wert von CHF 149",
    "gift.lead": "Als Dankeschön für dein Vertrauen erhältst du ein Babyphone, bei erfolgreicher Anmeldung über uns und gemäss den Kampagnenbedingungen. Das Babyphone ist ein nettes Extra, nicht der Hauptgrund.",
    "gift.condition": "* Erhältlich ausschliesslich bei erfolgreicher Anmeldung über uns und nach erfüllten Kampagnenbedingungen.",
    "gift.cta": "Jetzt anmelden",

    "steps.eyebrow": "In 3 Schritten",
    "steps.title": "So einfach geht's",
    "steps.s1Title": "Formular ausfüllen",
    "steps.s1Text": "Trag deine Angaben ein, in weniger als zwei Minuten.",
    "steps.s2Title": "Kurzes Gespräch",
    "steps.s2Text": "Wir melden uns und klären deine Fragen, kostenlos und unverbindlich.",
    "steps.s3Title": "Anmeldung & Babyphone",
    "steps.s3Text": "Wir schliessen die Anmeldung ab, dein Babyphone gibt's als Dankeschön.*",
    "steps.cta": "Jetzt starten",

    "benefits.eyebrow": "Deine Vorteile",
    "benefits.title": "Darum lohnt sich die frühzeitige Anmeldung",
    "benefits.b1": "Frühzeitig erledigt",
    "benefits.b2": "Kostenlos & unverbindlich",
    "benefits.b3": "Persönliche Unterstützung",
    "benefits.b4": "Ohne Risikoprüfung",
    "benefits.b5": "Für werdende Eltern",
    "benefits.b6": "Babyphone als Dankeschön*",

    "formRecall.title": "Bereit? Fordere deine kostenlose Beratung an",
    "formRecall.lead": "Wir melden uns telefonisch oder per E-Mail. Keine Verpflichtung.",
    "formRecall.cta": "Zum Formular",

    "faq.eyebrow": "FAQ",
    "faq.title": "Häufige Fragen",
    "faq.q1": "Was ist eine vorgeburtliche Krankenkassenanmeldung?",
    "faq.a1": "Es ist die Anmeldung deines Babys bei der Krankenkasse bereits vor der Geburt. So ist alles vorbereitet und die Versicherung kann fristgerecht starten, sobald dein Baby da ist.",
    "faq.q2": "Warum vor der Geburt anmelden?",
    "faq.a2": "Der wichtigste Grund: Bei der vorgeburtlichen Anmeldung werden die Zusatzversicherungen ohne Risikoprüfung aufgenommen. So ist dein Baby von der ersten Minute an geschützt, auch wenn es mit einem Geburtsgebrechen oder Leiden zur Welt kommt. Meldest du erst nach der Geburt an, ist meist eine Risikoprüfung nötig, und bei einem Leiden kann die Zusatzversicherung abgelehnt werden.",
    "faq.q3": "Ist die Beratung kostenlos?",
    "faq.a3": "Ja. Die Beratung ist komplett kostenlos und unverbindlich. Es entstehen dir keine Kosten und du gehst keine Verpflichtung ein.",
    "faq.q4": "Bekomme ich das Babyphone garantiert?",
    "faq.a4": "Das Babyphone ist ein Dankeschön bei erfolgreicher Anmeldung über uns und nach erfüllten Kampagnenbedingungen. Es ist ein nettes Extra, nicht der Hauptgrund für die Beratung.",
    "faq.q5": "Was bedeutet «erfolgreiche Anmeldung»?",
    "faq.a5": "Eine erfolgreiche Anmeldung bedeutet, dass die vorgeburtliche Krankenkassenanmeldung deines Babys über uns abgeschlossen wird. Die genauen Bedingungen findest du in den Kampagnenbedingungen.",
    "faq.q6": "Kann ich mich melden, wenn das Baby schon geboren ist?",
    "faq.a6": "Ja, melde dich trotzdem. Wir schauen gemeinsam, was in deiner Situation sinnvoll ist und welche Schritte noch offen sind.",
    "faq.q7": "Welche Angaben brauche ich?",
    "faq.a7": "Für den Start genügen Name, Telefonnummer, E-Mail, PLZ und der errechnete Geburtstermin. Alles Weitere besprechen wir im persönlichen Gespräch.",
    "faq.q8": "Muss ich direkt etwas unterschreiben?",
    "faq.a8": "Nein. Mit dem Formular forderst du nur die kostenlose Beratung an. Du entscheidest in aller Ruhe und gehst keine Verpflichtung ein.",
    "faq.q9": "Werde ich telefonisch kontaktiert?",
    "faq.a9": "Wir melden uns telefonisch oder per E-Mail, je nachdem, wie es dir am besten passt. Du kannst das im Gespräch jederzeit sagen.",
    "faq.q10": "Gilt das Angebot in der ganzen Schweiz?",
    "faq.a10": "Ja, unsere Beratung richtet sich an werdende Eltern in der ganzen Deutschschweiz und darüber hinaus.",
    "faq.q11": "Geht die Beratung auch auf EN/FR/IT?",
    "faq.a11": "Diese Seite ist auf Deutsch, Englisch, Französisch und Italienisch verfügbar. Sag uns einfach, in welcher Sprache du dich am wohlsten fühlst.",

    "finalCta.title": "Erledige die Anmeldung fürs Baby frühzeitig und stressfrei.",
    "finalCta.lead": "Kostenlos, unverbindlich und persönlich. Wir begleiten dich Schritt für Schritt.",
    "finalCta.cta": "Jetzt kostenlos anmelden",

    "footer.tagline": "Kostenlose, unverbindliche Beratung zur vorgeburtlichen Krankenkassenanmeldung fürs Baby.",
    "footer.imprint": "Impressum",
    "footer.privacy": "Datenschutz",
    "footer.contact": "Kontakt",
    "footer.legal": "Hinweis: Wir geben kein Versicherungsversprechen ab. Die Beratung ist kostenlos und unverbindlich. Das Babyphone ist ein Dankeschön bei erfolgreicher Anmeldung über uns und gemäss den Kampagnenbedingungen.",

    "sticky.cta": "Jetzt kostenlos anmelden",

    "wizard.progressStart": "Du hast schon angefangen",
    "wizard.progress": "Schritt {step} von {total}",
    "wizard.q1": "Wann ist der errechnete Geburtstermin?",
    "wizard.q1Help": "Wir zeigen dir sofort, was wann zu erledigen ist.",
    "wizard.q2": "Wo wohnt ihr?",
    "wizard.q2Help": "Nur die PLZ, den Ort ergänzen wir automatisch.",
    "wizard.q3": "Wie heisst du?",
    "wizard.q3Help": "Damit wir dich persönlich ansprechen können.",
    "wizard.q4": "Wie erreichen wir dich?",
    "wizard.q4Help": "Kostenlos und unverbindlich, du entscheidest in aller Ruhe.",
    "wizard.next": "Weiter",
    "wizard.back": "Zurück",
    "wizard.anchor": "Nach erfolgreicher Anmeldung: Babyphone im Wert von CHF 149 als Dankeschön*",
    "wizard.cdWeeks": "Noch {weeks} Wochen bis zur Geburt: jetzt ist der ideale Zeitpunkt, dich anzumelden.",
    "wizard.cdNow": "Der Termin ist da: melde dich jetzt an, damit alles bereit ist.",
    "wizard.cdPast": "Termin bereits vorbei? Kein Problem, melde dich, wir schauen gemeinsam die nächsten Schritte an.",
    "form.ort": "Ort",
    "form.ortPlaceholder": "wird ergänzt",
    "timeline.title": "Deine persönliche Anmelde-Timeline",
    "timeline.i1t": "Jetzt",
    "timeline.i1d": "Kostenlose Beratung anfordern und Fragen klären.",
    "timeline.i2t": "Vor der Geburt",
    "timeline.i2d": "Krankenkasse vergleichen und Anmeldung vorbereiten.",
    "timeline.i3t": "Rund um die Geburt",
    "timeline.i3d": "Anmeldung abschliessen, sobald dein Baby da ist.",
    "timeline.i4t": "Danach",
    "timeline.i4d": "Babyphone als Dankeschön bei erfolgreicher Anmeldung.*",
    "exit.title": "Termin noch nicht eingetragen?",
    "exit.text": "Dauert nur 30 Sekunden, und du siehst sofort deine persönliche Anmelde-Timeline.",
    "exit.cta": "Jetzt in 30 Sekunden starten",
    "exit.dismiss": "Später",
    "consent.title": "Wir respektieren deine Privatsphäre",
    "consent.text": "Wir verwenden notwendige Cookies für den Betrieb der Website. Mit deiner Einwilligung nutzen wir zusätzlich Statistik- und Marketing-Dienste. Details in der",
    "consent.link": "Datenschutzerklärung",
    "consent.necessary": "Notwendig",
    "consent.necessaryHint": "Für den Grundbetrieb erforderlich. Immer aktiv.",
    "consent.stats": "Statistik",
    "consent.statsHint": "Google Analytics: anonyme Nutzungsanalyse.",
    "consent.marketing": "Marketing",
    "consent.marketingHint": "Meta-Pixel: Messung und Optimierung von Werbung.",
    "consent.reject": "Nur notwendige",
    "consent.customize": "Auswählen",
    "consent.save": "Auswahl speichern",
    "consent.accept": "Alle akzeptieren"
  },

  /* ---------------- ENGLISCH ---------------- */
  en: {
    "meta.title": "Express Vorgeburtlich: Health Insurance Sign-Up for Your Baby",
    "meta.description": "Free, no-obligation guidance for the prenatal health insurance sign-up for your baby. Swiss advice, simple & done in time.",
    "meta.ogTitle": "Health insurance sign-up for your baby: simple & in time",
    "meta.ogDescription": "Free, no-obligation guidance for your baby's prenatal sign-up. A baby monitor as a thank-you upon successful registration.",

    "nav.process": "How it works",
    "nav.benefits": "Benefits",
    "nav.faq": "FAQ",
    "nav.cta": "Sign up now",

    "hero.eyebrow": "Prenatal health insurance sign-up",
    "hero.title": "Your baby's sign-up: simple & done in time",
    "hero.sub": "We guide you through your baby's prenatal sign-up, free and with no obligation. Personal, Swiss, without complicated research.",
    "hero.cta": "Get free guidance now",
    "hero.ctaSecondary": "How it works",
    "hero.giftNote": "Baby monitor (CHF 149) as a thank-you upon successful registration*",
    "hero.urgency": "Important: after the birth, a pre-existing condition can lead to refusal of the supplementary insurance.",

    "trust.free": "Free & no obligation",
    "trust.swiss": "Swiss advice",
    "trust.parents": "For expecting parents",
    "trust.noRisk": "No health check, even with conditions",

    "strip.free": "Free & no obligation",
    "strip.swiss": "Personal Swiss advice",
    "strip.data": "Data treated confidentially",
    "strip.fast": "Fast response",

    "form.title": "Get started in 2 minutes, no obligation",
    "form.lead": "Sign up, we'll get in touch by phone or email. No obligation.",
    "form.firstName": "First name *",
    "form.lastName": "Last name *",
    "form.phone": "Phone number *",
    "form.phonePlaceholder": "+41 79 123 45 67",
    "form.email": "Email *",
    "form.zip": "Postcode *",
    "form.dueDate": "Estimated due date *",
    "form.address": "Address (optional)",
    "form.addressPlaceholder": "Street & no.",
    "form.privacy": "I accept the",
    "form.privacyLink": "privacy policy",
    "form.privacyStar": ". *",
    "form.keepInsurer": "I would like to register with my current health insurer.",
    "form.insurer": "Current health insurer",
    "form.insurerPlaceholder": "Please select …",
    "form.insurerOther": "Other",
    "form.insurerNote": "We will gladly take your wish into account and register your baby with your current health insurer.",
    "form.submit": "Enquire, no obligation",
    "form.microcopy": "We'll get in touch by phone or email. No obligation.",

    "err.required": "Please fill in this field.",
    "err.firstName": "Please enter your first name.",
    "err.lastName": "Please enter your last name.",
    "err.phone": "Please enter a valid Swiss phone number (e.g. +41 79 123 45 67 or 079 123 45 67).",
    "err.email": "Please enter a valid email address.",
    "err.zip": "Please enter a valid postcode (exactly 4 digits).",
    "err.dueDate": "Please enter the estimated due date.",
    "err.dueDatePast": "The date should be in the future. Please check it.",
    "err.privacy": "Please accept the privacy policy to continue.",

    "success.title": "Thank you, we've received your request!",
    "success.text": "We'll be in touch shortly. You can also book an appointment directly.",
    "success.calendly": "Book an appointment directly",
    "status.error": "Something went wrong. Please try again or contact us directly.",

    "problem.eyebrow": "The most common doubts",
    "problem.title": "Sound familiar?",
    "problem.lead": "There's a lot to organise around birth. Questions quickly come up about your baby's health insurance.",
    "problem.q1": "Which insurer is right for our baby?",
    "problem.q2": "Do we need supplementary insurance, and which one?",
    "problem.q3": "What needs to be done before the birth?",
    "problem.q4": "What if the baby is already here?",

    "solution.eyebrow": "How we support you",
    "solution.title": "We guide you cleanly through the process",
    "solution.lead": "You don't have to research everything yourself. We explain clearly what to do and when, and support your baby's sign-up on time and in person.",
    "solution.p1": "Clear explanation, no jargon",
    "solution.p2": "Done in time before the birth",
    "solution.p3": "Personal advice from Switzerland",
    "solution.cta": "Get free guidance now",

    "gift.badge": "Our thank-you",
    "gift.title": "A baby monitor worth CHF 149",
    "gift.lead": "As a thank-you for your trust you'll receive a baby monitor, upon successful registration through us and in line with the campaign conditions. The monitor is a nice extra, not the main reason.",
    "gift.condition": "* Available only upon successful registration through us and after meeting the campaign conditions.",
    "gift.cta": "Sign up now",

    "steps.eyebrow": "In 3 steps",
    "steps.title": "It's this simple",
    "steps.s1Title": "Fill in the form",
    "steps.s1Text": "Enter your details in under two minutes.",
    "steps.s2Title": "Short conversation",
    "steps.s2Text": "We get in touch and answer your questions, free and with no obligation.",
    "steps.s3Title": "Sign-up & baby monitor",
    "steps.s3Text": "We complete the sign-up, your baby monitor comes as a thank-you.*",
    "steps.cta": "Get started",

    "benefits.eyebrow": "Your benefits",
    "benefits.title": "Why signing up early pays off",
    "benefits.b1": "Done in time",
    "benefits.b2": "Free & no obligation",
    "benefits.b3": "Personal support",
    "benefits.b4": "No health check",
    "benefits.b5": "For expecting parents",
    "benefits.b6": "Baby monitor as a thank-you*",

    "formRecall.title": "Ready? Request your free guidance",
    "formRecall.lead": "We'll get in touch by phone or email. No obligation.",
    "formRecall.cta": "Go to the form",

    "faq.eyebrow": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq.q1": "What is a prenatal health insurance sign-up?",
    "faq.a1": "It's registering your baby with a health insurer before the birth, so everything is ready and cover can start on time once your baby arrives.",
    "faq.q2": "Why sign up before the birth?",
    "faq.a2": "The most important reason: with prenatal registration the supplementary insurance is accepted without a health check. Your baby is protected from the very first minute, even if it is born with a medical condition. If you only register after the birth, a health check is usually required, and with a pre-existing condition the supplementary insurance can be refused.",
    "faq.q3": "Is the guidance free?",
    "faq.a3": "Yes. The guidance is completely free and with no obligation. There are no costs and no commitment for you.",
    "faq.q4": "Am I guaranteed the baby monitor?",
    "faq.a4": "The baby monitor is a thank-you upon successful registration through us and after meeting the campaign conditions. It's a nice extra, not the main reason.",
    "faq.q5": "What does \"successful registration\" mean?",
    "faq.a5": "It means your baby's prenatal health insurance sign-up is completed through us. The exact conditions are in the campaign terms.",
    "faq.q6": "Can I get in touch if the baby is already born?",
    "faq.a6": "Yes, get in touch anyway. We'll look together at what makes sense in your situation and which steps are still open.",
    "faq.q7": "What details do I need?",
    "faq.a7": "To start, your name, phone number, email, postcode and estimated due date are enough. We discuss everything else personally.",
    "faq.q8": "Do I have to sign anything right away?",
    "faq.a8": "No. The form only requests the free guidance. You decide at your own pace with no obligation.",
    "faq.q9": "Will I be contacted by phone?",
    "faq.a9": "We get in touch by phone or email, whichever suits you best. You can tell us during the conversation.",
    "faq.q10": "Does the offer apply across Switzerland?",
    "faq.a10": "Yes, our guidance is for expecting parents across the German-speaking region and beyond.",
    "faq.q11": "Is the guidance available in EN/FR/IT?",
    "faq.a11": "This page is available in German, English, French and Italian. Just tell us which language you're most comfortable with.",

    "finalCta.title": "Get your baby's sign-up done early and stress-free.",
    "finalCta.lead": "Free, no obligation and personal. We guide you step by step.",
    "finalCta.cta": "Get free guidance now",

    "footer.tagline": "Free, no-obligation guidance for the prenatal health insurance sign-up for your baby.",
    "footer.imprint": "Imprint",
    "footer.privacy": "Privacy",
    "footer.contact": "Contact",
    "footer.legal": "Note: We make no insurance promises. The guidance is free and with no obligation. The baby monitor is a thank-you upon successful registration through us and in line with the campaign conditions.",

    "sticky.cta": "Get free guidance now",

    "wizard.progressStart": "You have already started",
    "wizard.progress": "Step {step} of {total}",
    "wizard.q1": "When is the estimated due date?",
    "wizard.q1Help": "We will instantly show you what to do and when.",
    "wizard.q2": "Where do you live?",
    "wizard.q2Help": "Just the postcode, we add the town automatically.",
    "wizard.q3": "What is your name?",
    "wizard.q3Help": "So we can address you personally.",
    "wizard.q4": "How can we reach you?",
    "wizard.q4Help": "Free and non-binding, you decide at your own pace.",
    "wizard.next": "Continue",
    "wizard.back": "Back",
    "wizard.anchor": "After a successful sign-up: a baby monitor worth CHF 149 as our thank-you*",
    "wizard.cdWeeks": "{weeks} weeks until the birth: now is the ideal time to sign up.",
    "wizard.cdNow": "The due date is here: sign up now so everything is ready.",
    "wizard.cdPast": "Due date already passed? No problem, get in touch and we will look at the next steps together.",
    "form.ort": "Town",
    "form.ortPlaceholder": "added automatically",
    "timeline.title": "Your personal sign-up timeline",
    "timeline.i1t": "Now",
    "timeline.i1d": "Request free guidance and clarify your questions.",
    "timeline.i2t": "Before the birth",
    "timeline.i2d": "Compare insurers and prepare the sign-up.",
    "timeline.i3t": "Around the birth",
    "timeline.i3d": "Complete the sign-up as soon as your baby arrives.",
    "timeline.i4t": "Afterwards",
    "timeline.i4d": "Baby monitor as a thank-you upon successful sign-up.*",
    "exit.title": "Due date not entered yet?",
    "exit.text": "It takes just 30 seconds, and you will instantly see your personal sign-up timeline.",
    "exit.cta": "Start now in 30 seconds",
    "exit.dismiss": "Later",
    "consent.title": "We respect your privacy",
    "consent.text": "We use necessary cookies to operate the website. With your consent we also use statistics and marketing services. Details in our",
    "consent.link": "privacy policy",
    "consent.necessary": "Necessary",
    "consent.necessaryHint": "Required for basic operation. Always active.",
    "consent.stats": "Statistics",
    "consent.statsHint": "Google Analytics: anonymous usage analysis.",
    "consent.marketing": "Marketing",
    "consent.marketingHint": "Meta Pixel: measuring and optimising ads.",
    "consent.reject": "Necessary only",
    "consent.customize": "Choose",
    "consent.save": "Save selection",
    "consent.accept": "Accept all"
  },

  /* ---------------- FRANZÖSISCH ---------------- */
  fr: {
    "meta.title": "Express Vorgeburtlich : inscription à l'assurance maladie pour bébé",
    "meta.description": "Conseil gratuit et sans engagement pour l'inscription prénatale de votre bébé à l'assurance maladie. Conseil suisse, simple et à temps.",
    "meta.ogTitle": "Inscription assurance maladie pour bébé : simple et à temps",
    "meta.ogDescription": "Conseil gratuit et sans engagement pour l'inscription prénatale de votre bébé. Un babyphone en remerciement en cas d'inscription réussie.",

    "nav.process": "Comment ça marche",
    "nav.benefits": "Avantages",
    "nav.faq": "FAQ",
    "nav.cta": "S'inscrire",

    "hero.eyebrow": "Inscription prénatale à l'assurance maladie",
    "hero.title": "L'inscription de bébé : simple et à temps",
    "hero.sub": "Nous vous accompagnons gratuitement et sans engagement dans l'inscription prénatale de votre bébé. De manière personnelle, en Suisse, sans recherches compliquées.",
    "hero.cta": "S'inscrire gratuitement",
    "hero.ctaSecondary": "Comment ça marche",
    "hero.giftNote": "Babyphone (CHF 149) en remerciement en cas d'inscription réussie*",
    "hero.urgency": "Important : après la naissance, une affection peut entraîner le refus de l'assurance complémentaire.",

    "trust.free": "Gratuit et sans engagement",
    "trust.swiss": "Conseil suisse",
    "trust.parents": "Pour les futurs parents",
    "trust.noRisk": "Sans examen de santé, même en cas d'affection",

    "strip.free": "Gratuit et sans engagement",
    "strip.swiss": "Conseil suisse personnel",
    "strip.data": "Données traitées confidentiellement",
    "strip.fast": "Réponse rapide",

    "form.title": "Commencez en 2 minutes, sans engagement",
    "form.lead": "Inscrivez-vous, nous vous contactons par téléphone ou e-mail. Sans engagement.",
    "form.firstName": "Prénom *",
    "form.lastName": "Nom *",
    "form.phone": "Numéro de téléphone *",
    "form.phonePlaceholder": "+41 79 123 45 67",
    "form.email": "E-mail *",
    "form.zip": "NPA *",
    "form.dueDate": "Date prévue de l'accouchement *",
    "form.address": "Adresse (facultatif)",
    "form.addressPlaceholder": "Rue & numéro",
    "form.privacy": "J'accepte la",
    "form.privacyLink": "politique de confidentialité",
    "form.privacyStar": ". *",
    "form.keepInsurer": "Je souhaite m'inscrire auprès de ma caisse maladie actuelle.",
    "form.insurer": "Caisse maladie actuelle",
    "form.insurerPlaceholder": "Veuillez choisir …",
    "form.insurerOther": "Autre",
    "form.insurerNote": "Nous tiendrons volontiers compte de votre souhait et inscrirons votre bébé auprès de votre caisse maladie actuelle.",
    "form.submit": "Demander sans engagement",
    "form.microcopy": "Nous vous contactons par téléphone ou e-mail. Sans engagement.",

    "err.required": "Veuillez remplir ce champ.",
    "err.firstName": "Veuillez indiquer votre prénom.",
    "err.lastName": "Veuillez indiquer votre nom.",
    "err.phone": "Veuillez saisir un numéro suisse valide (p. ex. +41 79 123 45 67 ou 079 123 45 67).",
    "err.email": "Veuillez saisir une adresse e-mail valide.",
    "err.zip": "Veuillez saisir un NPA valide (exactement 4 chiffres).",
    "err.dueDate": "Veuillez indiquer la date prévue de l'accouchement.",
    "err.dueDatePast": "La date devrait être dans le futur. Veuillez la vérifier.",
    "err.privacy": "Veuillez accepter la politique de confidentialité pour continuer.",

    "success.title": "Merci, nous avons bien reçu votre demande !",
    "success.text": "Nous vous contactons sous peu. Vous pouvez aussi réserver un rendez-vous directement.",
    "success.calendly": "Réserver un rendez-vous",
    "status.error": "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",

    "problem.eyebrow": "Les incertitudes les plus fréquentes",
    "problem.title": "Ces questions vous parlent ?",
    "problem.lead": "Il y a beaucoup à organiser autour de la naissance. Des incertitudes surgissent vite concernant l'assurance de bébé.",
    "problem.q1": "Quelle caisse maladie convient à notre bébé ?",
    "problem.q2": "Avons-nous besoin d'une assurance complémentaire, laquelle ?",
    "problem.q3": "Que faut-il régler avant la naissance ?",
    "problem.q4": "Et si bébé est déjà là ?",

    "solution.eyebrow": "Comment nous vous aidons",
    "solution.title": "Nous vous guidons proprement dans le processus",
    "solution.lead": "Vous n'avez pas à tout chercher vous-même. Nous expliquons clairement quoi faire et quand, et accompagnons l'inscription de votre bébé à temps et en personne.",
    "solution.p1": "Explication claire, sans jargon",
    "solution.p2": "Réglé à temps avant la naissance",
    "solution.p3": "Conseil personnel depuis la Suisse",
    "solution.cta": "S'inscrire gratuitement",

    "gift.badge": "Notre remerciement",
    "gift.title": "Un babyphone d'une valeur de CHF 149",
    "gift.lead": "En remerciement de votre confiance, vous recevez un babyphone, en cas d'inscription réussie via nous et selon les conditions de la campagne. Le babyphone est un petit plus, pas la raison principale.",
    "gift.condition": "* Disponible uniquement en cas d'inscription réussie via nous et après remplir les conditions de la campagne.",
    "gift.cta": "S'inscrire",

    "steps.eyebrow": "En 3 étapes",
    "steps.title": "C'est aussi simple",
    "steps.s1Title": "Remplir le formulaire",
    "steps.s1Text": "Saisissez vos informations en moins de deux minutes.",
    "steps.s2Title": "Court échange",
    "steps.s2Text": "Nous vous contactons et répondons à vos questions, gratuitement et sans engagement.",
    "steps.s3Title": "Inscription & babyphone",
    "steps.s3Text": "Nous finalisons l'inscription, votre babyphone en remerciement.*",
    "steps.cta": "Commencer",

    "benefits.eyebrow": "Vos avantages",
    "benefits.title": "Pourquoi s'inscrire tôt est avantageux",
    "benefits.b1": "Réglé à temps",
    "benefits.b2": "Gratuit et sans engagement",
    "benefits.b3": "Accompagnement personnel",
    "benefits.b4": "Sans examen de santé",
    "benefits.b5": "Pour les futurs parents",
    "benefits.b6": "Babyphone en remerciement*",

    "formRecall.title": "Prêt(e) ? Demandez votre conseil gratuit",
    "formRecall.lead": "Nous vous contactons par téléphone ou e-mail. Sans engagement.",
    "formRecall.cta": "Vers le formulaire",

    "faq.eyebrow": "FAQ",
    "faq.title": "Questions fréquentes",
    "faq.q1": "Qu'est-ce qu'une inscription prénatale à l'assurance maladie ?",
    "faq.a1": "C'est l'inscription de votre bébé auprès d'une caisse maladie avant la naissance, afin que tout soit prêt et que la couverture débute à temps dès l'arrivée de bébé.",
    "faq.q2": "Pourquoi s'inscrire avant la naissance ?",
    "faq.a2": "La raison la plus importante : avec une inscription prénatale, les assurances complémentaires sont acceptées sans examen de santé. Votre bébé est protégé dès la première minute, même s'il naît avec une affection. Si vous inscrivez votre bébé seulement après la naissance, un examen de santé est généralement requis, et en cas d'affection l'assurance complémentaire peut être refusée.",
    "faq.q3": "Le conseil est-il gratuit ?",
    "faq.a3": "Oui. Le conseil est entièrement gratuit et sans engagement. Aucun frais ni aucune obligation pour vous.",
    "faq.q4": "Le babyphone est-il garanti ?",
    "faq.a4": "Le babyphone est un remerciement en cas d'inscription réussie via nous et après les conditions de la campagne. C'est un petit plus, pas la raison principale.",
    "faq.q5": "Que signifie « inscription réussie » ?",
    "faq.a5": "Cela signifie que l'inscription prénatale de votre bébé est finalisée via nous. Les conditions exactes figurent dans les conditions de la campagne.",
    "faq.q6": "Puis-je vous contacter si bébé est déjà né ?",
    "faq.a6": "Oui, contactez-nous quand même. Nous regardons ensemble ce qui est pertinent dans votre situation.",
    "faq.q7": "Quelles informations me faut-il ?",
    "faq.a7": "Pour commencer : nom, téléphone, e-mail, NPA et date prévue de l'accouchement. Le reste se discute en personne.",
    "faq.q8": "Dois-je signer quelque chose tout de suite ?",
    "faq.a8": "Non. Le formulaire demande seulement le conseil gratuit. Vous décidez en toute tranquillité, sans engagement.",
    "faq.q9": "Serai-je contacté(e) par téléphone ?",
    "faq.a9": "Nous vous contactons par téléphone ou e-mail, selon ce qui vous convient le mieux.",
    "faq.q10": "L'offre est-elle valable dans toute la Suisse ?",
    "faq.a10": "Oui, notre conseil s'adresse aux futurs parents dans toute la Suisse.",
    "faq.q11": "Le conseil est-il aussi en EN/FR/IT ?",
    "faq.a11": "Cette page est disponible en allemand, anglais, français et italien. Dites-nous simplement la langue qui vous convient le mieux.",

    "finalCta.title": "Réglez l'inscription de bébé tôt et sans stress.",
    "finalCta.lead": "Gratuit, sans engagement et personnel. Nous vous guidons pas à pas.",
    "finalCta.cta": "S'inscrire gratuitement",

    "footer.tagline": "Conseil gratuit et sans engagement pour l'inscription prénatale de votre bébé à l'assurance maladie.",
    "footer.imprint": "Mentions légales",
    "footer.privacy": "Confidentialité",
    "footer.contact": "Contact",
    "footer.legal": "Remarque : nous ne donnons aucune promesse d'assurance. Le conseil est gratuit et sans engagement. Le babyphone est un remerciement en cas d'inscription réussie via nous et selon les conditions de la campagne.",

    "sticky.cta": "S'inscrire gratuitement",

    "wizard.progressStart": "Vous avez déjà commencé",
    "wizard.progress": "Étape {step} sur {total}",
    "wizard.q1": "Quelle est la date prévue de l'accouchement?",
    "wizard.q1Help": "Nous vous montrons aussitôt quoi faire et quand.",
    "wizard.q2": "Où habitez-vous?",
    "wizard.q2Help": "Juste le NPA, nous complétons la localité automatiquement.",
    "wizard.q3": "Comment vous appelez-vous?",
    "wizard.q3Help": "Pour pouvoir vous adresser personnellement.",
    "wizard.q4": "Comment vous joindre?",
    "wizard.q4Help": "Gratuit et sans engagement, vous décidez à votre rythme.",
    "wizard.next": "Continuer",
    "wizard.back": "Retour",
    "wizard.anchor": "Après une inscription réussie: un babyphone d'une valeur de CHF 149 en remerciement*",
    "wizard.cdWeeks": "Encore {weeks} semaines avant la naissance: c'est le moment idéal pour vous inscrire.",
    "wizard.cdNow": "La date est arrivée: inscrivez-vous maintenant pour que tout soit prêt.",
    "wizard.cdPast": "Date déjà passée? Aucun souci, contactez-nous et nous verrons ensemble les prochaines étapes.",
    "form.ort": "Localité",
    "form.ortPlaceholder": "complété automatiquement",
    "timeline.title": "Votre calendrier d'inscription personnel",
    "timeline.i1t": "Maintenant",
    "timeline.i1d": "Demandez un conseil gratuit et clarifiez vos questions.",
    "timeline.i2t": "Avant la naissance",
    "timeline.i2d": "Comparez les caisses et préparez l'inscription.",
    "timeline.i3t": "Autour de la naissance",
    "timeline.i3d": "Finalisez l'inscription dès l'arrivée de votre bébé.",
    "timeline.i4t": "Ensuite",
    "timeline.i4d": "Babyphone en remerciement après une inscription réussie.*",
    "exit.title": "Date pas encore renseignée?",
    "exit.text": "Cela ne prend que 30 secondes, et vous verrez aussitôt votre calendrier d'inscription personnel.",
    "exit.cta": "Commencer en 30 secondes",
    "exit.dismiss": "Plus tard",
    "consent.title": "Nous respectons ta vie privée",
    "consent.text": "Nous utilisons des cookies nécessaires au fonctionnement du site. Avec ton consentement, nous utilisons aussi des services de statistique et de marketing. Détails dans notre",
    "consent.link": "déclaration de confidentialité",
    "consent.necessary": "Nécessaire",
    "consent.necessaryHint": "Requis pour le fonctionnement de base. Toujours actif.",
    "consent.stats": "Statistique",
    "consent.statsHint": "Google Analytics: analyse anonyme de l'utilisation.",
    "consent.marketing": "Marketing",
    "consent.marketingHint": "Pixel Meta: mesure et optimisation des publicités.",
    "consent.reject": "Nécessaires uniquement",
    "consent.customize": "Choisir",
    "consent.save": "Enregistrer la sélection",
    "consent.accept": "Tout accepter"
  },

  /* ---------------- ITALIENISCH ---------------- */
  it: {
    "meta.title": "Express Vorgeburtlich: iscrizione alla cassa malati per il bebè",
    "meta.description": "Consulenza gratuita e senza impegno per l'iscrizione prenatale del tuo bebè alla cassa malati. Consulenza svizzera, semplice e in tempo.",
    "meta.ogTitle": "Iscrizione cassa malati per il bebè: semplice e in tempo",
    "meta.ogDescription": "Consulenza gratuita e senza impegno per l'iscrizione prenatale del tuo bebè. Un baby monitor in regalo in caso di iscrizione riuscita.",

    "nav.process": "Come funziona",
    "nav.benefits": "Vantaggi",
    "nav.faq": "FAQ",
    "nav.cta": "Iscriviti ora",

    "hero.eyebrow": "Iscrizione prenatale alla cassa malati",
    "hero.title": "L'iscrizione del bebè: semplice e in tempo",
    "hero.sub": "Ti accompagniamo gratuitamente e senza impegno nell'iscrizione prenatale del tuo bebè. In modo personale, in Svizzera, senza ricerche complicate.",
    "hero.cta": "Iscriviti gratis ora",
    "hero.ctaSecondary": "Come funziona",
    "hero.giftNote": "Baby monitor (CHF 149) come ringraziamento con iscrizione riuscita*",
    "hero.urgency": "Importante: dopo la nascita, una patologia può portare al rifiuto dell'assicurazione complementare.",

    "trust.free": "Gratuito e senza impegno",
    "trust.swiss": "Consulenza svizzera",
    "trust.parents": "Per i futuri genitori",
    "trust.noRisk": "Senza esame sanitario, anche con patologie",

    "strip.free": "Gratuito e senza impegno",
    "strip.swiss": "Consulenza svizzera personale",
    "strip.data": "Dati trattati in modo riservato",
    "strip.fast": "Risposta rapida",

    "form.title": "Inizia in 2 minuti, senza impegno",
    "form.lead": "Iscriviti, ti contattiamo per telefono o e-mail. Senza impegno.",
    "form.firstName": "Nome *",
    "form.lastName": "Cognome *",
    "form.phone": "Numero di telefono *",
    "form.phonePlaceholder": "+41 79 123 45 67",
    "form.email": "E-mail *",
    "form.zip": "NAP *",
    "form.dueDate": "Data presunta del parto *",
    "form.address": "Indirizzo (facoltativo)",
    "form.addressPlaceholder": "Via & numero",
    "form.privacy": "Accetto l'",
    "form.privacyLink": "informativa sulla privacy",
    "form.privacyStar": ". *",
    "form.keepInsurer": "Desidero iscrivermi presso la mia cassa malati attuale.",
    "form.insurer": "Cassa malati attuale",
    "form.insurerPlaceholder": "Si prega di scegliere …",
    "form.insurerOther": "Altra",
    "form.insurerNote": "Terremo volentieri conto del tuo desiderio e iscriveremo il tuo bambino presso la tua cassa malati attuale.",
    "form.submit": "Richiedi senza impegno",
    "form.microcopy": "Ti contattiamo per telefono o e-mail. Senza impegno.",

    "err.required": "Compila questo campo.",
    "err.firstName": "Inserisci il tuo nome.",
    "err.lastName": "Inserisci il tuo cognome.",
    "err.phone": "Inserisci un numero svizzero valido (es. +41 79 123 45 67 o 079 123 45 67).",
    "err.email": "Inserisci un indirizzo e-mail valido.",
    "err.zip": "Inserisci un NAP valido (esattamente 4 cifre).",
    "err.dueDate": "Indica la data presunta del parto.",
    "err.dueDatePast": "La data dovrebbe essere nel futuro. Controlla per favore.",
    "err.privacy": "Accetta l'informativa sulla privacy per continuare.",

    "success.title": "Grazie, abbiamo ricevuto la tua richiesta!",
    "success.text": "Ti contattiamo a breve. Puoi anche fissare subito un appuntamento.",
    "success.calendly": "Fissa subito un appuntamento",
    "status.error": "Qualcosa è andato storto. Riprova o contattaci direttamente.",

    "problem.eyebrow": "I dubbi più frequenti",
    "problem.title": "Ti suonano familiari?",
    "problem.lead": "C'è molto da organizzare attorno alla nascita. Sull'assicurazione del bebè sorgono presto dei dubbi.",
    "problem.q1": "Quale cassa malati è giusta per il nostro bebè?",
    "problem.q2": "Serve un'assicurazione complementare, e quale?",
    "problem.q3": "Cosa va sistemato prima della nascita?",
    "problem.q4": "E se il bebè è già nato?",

    "solution.eyebrow": "Come ti supportiamo",
    "solution.title": "Ti guidiamo con chiarezza nel processo",
    "solution.lead": "Non devi cercare tutto da solo. Ti spieghiamo chiaramente cosa fare e quando, e accompagniamo l'iscrizione del tuo bebè in tempo e di persona.",
    "solution.p1": "Spiegazione chiara, senza tecnicismi",
    "solution.p2": "Sistemato in tempo prima della nascita",
    "solution.p3": "Consulenza personale dalla Svizzera",
    "solution.cta": "Iscriviti gratis ora",

    "gift.badge": "Il nostro ringraziamento",
    "gift.title": "Un baby monitor del valore di CHF 149",
    "gift.lead": "Come ringraziamento per la tua fiducia ricevi un baby monitor, in caso di iscrizione riuscita tramite noi e secondo le condizioni della campagna. Il baby monitor è un extra gradito, non il motivo principale.",
    "gift.condition": "* Disponibile solo in caso di iscrizione riuscita tramite noi e dopo aver soddisfatto le condizioni della campagna.",
    "gift.cta": "Iscriviti ora",

    "steps.eyebrow": "In 3 passi",
    "steps.title": "È così semplice",
    "steps.s1Title": "Compila il modulo",
    "steps.s1Text": "Inserisci i tuoi dati in meno di due minuti.",
    "steps.s2Title": "Breve colloquio",
    "steps.s2Text": "Ti contattiamo e rispondiamo alle tue domande, gratis e senza impegno.",
    "steps.s3Title": "Iscrizione & baby monitor",
    "steps.s3Text": "Completiamo l'iscrizione, il baby monitor come ringraziamento.*",
    "steps.cta": "Inizia ora",

    "benefits.eyebrow": "I tuoi vantaggi",
    "benefits.title": "Perché conviene iscriversi presto",
    "benefits.b1": "Sistemato in tempo",
    "benefits.b2": "Gratuito e senza impegno",
    "benefits.b3": "Supporto personale",
    "benefits.b4": "Senza esame sanitario",
    "benefits.b5": "Per i futuri genitori",
    "benefits.b6": "Baby monitor come ringraziamento*",

    "formRecall.title": "Pronto/a? Richiedi la tua consulenza gratuita",
    "formRecall.lead": "Ti contattiamo per telefono o e-mail. Senza impegno.",
    "formRecall.cta": "Vai al modulo",

    "faq.eyebrow": "FAQ",
    "faq.title": "Domande frequenti",
    "faq.q1": "Cos'è l'iscrizione prenatale alla cassa malati?",
    "faq.a1": "È l'iscrizione del tuo bebè a una cassa malati prima della nascita, così tutto è pronto e la copertura può iniziare in tempo all'arrivo del bebè.",
    "faq.q2": "Perché iscriversi prima della nascita?",
    "faq.a2": "Il motivo più importante: con l'iscrizione prenatale le assicurazioni complementari vengono accettate senza esame sanitario. Il tuo bambino è protetto fin dal primo minuto, anche se nasce con una malformazione o una patologia. Se invece lo iscrivi solo dopo la nascita, di norma è necessario un esame sanitario e, in caso di patologia, l'assicurazione complementare può essere rifiutata.",
    "faq.q3": "La consulenza è gratuita?",
    "faq.a3": "Sì. La consulenza è completamente gratuita e senza impegno. Nessun costo e nessun obbligo per te.",
    "faq.q4": "Il baby monitor è garantito?",
    "faq.a4": "Il baby monitor è un ringraziamento in caso di iscrizione riuscita tramite noi e secondo le condizioni della campagna. È un extra gradito, non il motivo principale.",
    "faq.q5": "Cosa significa «iscrizione riuscita»?",
    "faq.a5": "Significa che l'iscrizione prenatale del tuo bebè viene completata tramite noi. Le condizioni esatte sono nelle condizioni della campagna.",
    "faq.q6": "Posso contattarvi se il bebè è già nato?",
    "faq.a6": "Sì, contattaci comunque. Valutiamo insieme cosa ha senso nella tua situazione.",
    "faq.q7": "Quali dati mi servono?",
    "faq.a7": "Per iniziare bastano nome, telefono, e-mail, NAP e data presunta del parto. Il resto lo discutiamo di persona.",
    "faq.q8": "Devo firmare subito qualcosa?",
    "faq.a8": "No. Con il modulo richiedi solo la consulenza gratuita. Decidi con calma, senza impegno.",
    "faq.q9": "Sarò contattato/a per telefono?",
    "faq.a9": "Ti contattiamo per telefono o e-mail, come preferisci.",
    "faq.q10": "L'offerta vale in tutta la Svizzera?",
    "faq.a10": "Sì, la nostra consulenza è per i futuri genitori in tutta la Svizzera.",
    "faq.q11": "La consulenza è anche in EN/FR/IT?",
    "faq.a11": "Questa pagina è disponibile in tedesco, inglese, francese e italiano. Dicci semplicemente la lingua con cui ti trovi meglio.",

    "finalCta.title": "Sistema l'iscrizione del bebè presto e senza stress.",
    "finalCta.lead": "Gratis, senza impegno e personale. Ti guidiamo passo dopo passo.",
    "finalCta.cta": "Iscriviti gratis ora",

    "footer.tagline": "Consulenza gratuita e senza impegno per l'iscrizione prenatale del tuo bebè alla cassa malati.",
    "footer.imprint": "Impressum",
    "footer.privacy": "Privacy",
    "footer.contact": "Contatto",
    "footer.legal": "Nota: non diamo alcuna promessa assicurativa. La consulenza è gratuita e senza impegno. Il baby monitor è un ringraziamento in caso di iscrizione riuscita tramite noi e secondo le condizioni della campagna.",

    "sticky.cta": "Iscriviti gratis ora",

    "wizard.progressStart": "Hai già iniziato",
    "wizard.progress": "Passo {step} di {total}",
    "wizard.q1": "Qual è la data presunta del parto?",
    "wizard.q1Help": "Ti mostriamo subito cosa fare e quando.",
    "wizard.q2": "Dove abitate?",
    "wizard.q2Help": "Solo il NAP, la località la aggiungiamo automaticamente.",
    "wizard.q3": "Come ti chiami?",
    "wizard.q3Help": "Così possiamo rivolgerci a te personalmente.",
    "wizard.q4": "Come possiamo contattarti?",
    "wizard.q4Help": "Gratuito e senza impegno, decidi con tutta calma.",
    "wizard.next": "Continua",
    "wizard.back": "Indietro",
    "wizard.anchor": "Dopo un'iscrizione riuscita: un baby monitor del valore di CHF 149 come ringraziamento*",
    "wizard.cdWeeks": "Ancora {weeks} settimane alla nascita: è il momento ideale per iscriverti.",
    "wizard.cdNow": "La data è arrivata: iscriviti ora così è tutto pronto.",
    "wizard.cdPast": "Data già passata? Nessun problema, contattaci e vediamo insieme i prossimi passi.",
    "form.ort": "Località",
    "form.ortPlaceholder": "aggiunto automaticamente",
    "timeline.title": "La tua timeline di iscrizione personale",
    "timeline.i1t": "Ora",
    "timeline.i1d": "Richiedi una consulenza gratuita e chiarisci le tue domande.",
    "timeline.i2t": "Prima della nascita",
    "timeline.i2d": "Confronta le casse e prepara l'iscrizione.",
    "timeline.i3t": "Intorno alla nascita",
    "timeline.i3d": "Completa l'iscrizione non appena arriva il tuo bambino.",
    "timeline.i4t": "Dopo",
    "timeline.i4d": "Baby monitor come ringraziamento dopo un'iscrizione riuscita.*",
    "exit.title": "Data non ancora inserita?",
    "exit.text": "Bastano 30 secondi e vedrai subito la tua timeline di iscrizione personale.",
    "exit.cta": "Inizia in 30 secondi",
    "exit.dismiss": "Più tardi",
    "consent.title": "Rispettiamo la tua privacy",
    "consent.text": "Utilizziamo cookie necessari per il funzionamento del sito. Con il tuo consenso usiamo anche servizi di statistica e marketing. Dettagli nella nostra",
    "consent.link": "informativa sulla privacy",
    "consent.necessary": "Necessari",
    "consent.necessaryHint": "Necessari per il funzionamento di base. Sempre attivi.",
    "consent.stats": "Statistica",
    "consent.statsHint": "Google Analytics: analisi anonima dell'utilizzo.",
    "consent.marketing": "Marketing",
    "consent.marketingHint": "Meta Pixel: misurazione e ottimizzazione della pubblicità.",
    "consent.reject": "Solo necessari",
    "consent.customize": "Scegli",
    "consent.save": "Salva selezione",
    "consent.accept": "Accetta tutti"
  }
};

/* ============================================================
   3) Sprachsteuerung
   ============================================================ */
const SUPPORTED_LANGS = ["de", "en", "fr", "it"];

function getInitialLang() {
  // 1) gespeicherte Wahl, 2) Browsersprache, 3) defaultLang
  const stored = localStorage.getItem("ev_lang");
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const browser = (navigator.language || "de").slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(browser)) return browser;
  return CONFIG.defaultLang;
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = CONFIG.defaultLang;
  const dict = I18N[lang];

  // Sichtbare Texte
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) {
      // Meta-Tags & Title separat behandeln
      if (el.tagName === "META") {
        el.setAttribute("content", dict[key]);
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Platzhalter
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });

  // lang-Attribut & Speicherung
  document.documentElement.lang = lang;
  localStorage.setItem("ev_lang", lang);

  // Sprachumschalter-States
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });

  // aktuelle Sprache fuer Validierungsmeldungen merken
  document.documentElement.dataset.activeLang = lang;

  // Dynamisch generierte Inhalte (Countdown/Timeline) neu rendern lassen
  document.dispatchEvent(new CustomEvent("ev:lang"));
}

function t(key) {
  const lang = document.documentElement.dataset.activeLang || CONFIG.defaultLang;
  return (I18N[lang] && I18N[lang][key]) || (I18N.de[key] || key);
}

/* ============================================================
   4) CONFIG in DOM einsetzen (Links, Buttons, Sichtbarkeit)
   ============================================================ */
function applyConfig() {
  // Footer-Kontakt
  const footerEmail = document.getElementById("footerEmail");
  const footerPhone = document.getElementById("footerPhone");
  if (footerEmail && CONFIG.email) { footerEmail.textContent = CONFIG.email; footerEmail.href = "mailto:" + CONFIG.email; }
  if (footerPhone && CONFIG.phone) { footerPhone.textContent = CONFIG.phone; footerPhone.href = "tel:" + CONFIG.phone.replace(/\s+/g, ""); }

  // Datenschutz- & Impressum-Links
  document.querySelectorAll('a[href="REPLACE_PRIVACY_URL"]').forEach((a) => { if (CONFIG.privacyUrl) a.href = CONFIG.privacyUrl; });
  document.querySelectorAll('a[href="REPLACE_IMPRINT_URL"]').forEach((a) => { if (CONFIG.imprintUrl) a.href = CONFIG.imprintUrl; });

  // Calendly-Button (nur wenn URL gesetzt)
  const calendlyBtn = document.getElementById("calendlyBtn");
  if (calendlyBtn) {
    if (CONFIG.calendlyUrl && !/^REPLACE_/.test(CONFIG.calendlyUrl)) {
      calendlyBtn.href = CONFIG.calendlyUrl;
      calendlyBtn.hidden = false;
    } else {
      calendlyBtn.hidden = true;
    }
  }

  // WhatsApp-Floating-Button (nur wenn URL gesetzt)
  const fab = document.getElementById("whatsappFab");
  if (fab) {
    if (CONFIG.whatsappUrl && !/^REPLACE_/.test(CONFIG.whatsappUrl)) {
      fab.href = CONFIG.whatsappUrl;
      fab.hidden = false;
    } else {
      fab.hidden = true;
    }
  }

  // Jahr im Footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

/* ============================================================
   5) Validierung
   ============================================================ */
// CH-Telefon: +41/0041 oder 0, danach Schweizer Format. Leerzeichen/Bindestriche erlaubt.
const PHONE_RE = /^(?:\+41|0041|0)\s?(?:\(0\))?\s?[1-9](?:[\s.-]?\d){8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{4}$/;

function setFieldError(input, messageKey) {
  const errEl = document.getElementById("err-" + input.id);
  if (messageKey) {
    input.setAttribute("aria-invalid", "true");
    if (errEl) errEl.textContent = t(messageKey);
    return false;
  } else {
    input.removeAttribute("aria-invalid");
    if (errEl) errEl.textContent = "";
    return true;
  }
}

function validateField(input) {
  const id = input.id;
  const val = (input.value || "").trim();

  switch (id) {
    case "firstName":
      return val ? setFieldError(input, null) : setFieldError(input, "err.firstName");
    case "lastName":
      return val ? setFieldError(input, null) : setFieldError(input, "err.lastName");
    case "phone":
      if (!val) return setFieldError(input, "err.phone");
      return PHONE_RE.test(val) ? setFieldError(input, null) : setFieldError(input, "err.phone");
    case "email":
      if (!val) return setFieldError(input, "err.email");
      return EMAIL_RE.test(val) ? setFieldError(input, null) : setFieldError(input, "err.email");
    case "zip":
      if (!val) return setFieldError(input, "err.zip");
      return ZIP_RE.test(val) ? setFieldError(input, null) : setFieldError(input, "err.zip");
    case "dueDate": {
      if (!val) return setFieldError(input, "err.dueDate");
      const picked = new Date(val + "T00:00:00");
      const today = new Date(); today.setHours(0, 0, 0, 0);
      // Sanfte Validierung: Vergangenheit → Hinweis, aber kein hartes Blockieren des Sinns
      if (picked < today) return setFieldError(input, "err.dueDatePast");
      return setFieldError(input, null);
    }
    case "privacy":
      return input.checked ? setFieldError(input, null) : setFieldError(input, "err.privacy");
    default:
      return true;
  }
}

function validateForm(form) {
  const fields = ["firstName", "lastName", "phone", "email", "zip", "dueDate", "privacy"];
  let firstInvalid = null;
  let valid = true;
  fields.forEach((id) => {
    const input = form.elements[id];
    if (input && !validateField(input)) {
      valid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });
  if (firstInvalid) firstInvalid.focus();
  return valid;
}

/* ============================================================
   5b) Lead-Draft: Autosave + Resume (clientseitig) und optionales
       Teil-Lead-Capturing, um Abspringer nachfassen zu können.
       Grösster versteckter Hebel bei Multi-Step-Formularen.
   ============================================================ */
const LeadDraft = (function () {
  const KEY = "ev_lead_draft";
  const FIELD_IDS = ["dueDate", "zip", "ort", "firstName", "lastName", "phone", "email", "insurer"];
  let lastSentHash = "";

  function form() { return document.getElementById("leadForm"); }

  function genId() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (_) {}
    return "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (_) { return null; }
  }

  function collect() {
    const f = form();
    const data = {};
    if (!f) return data;
    FIELD_IDS.forEach((id) => {
      const el = f.elements[id];
      if (el) data[id] = (el.value || "").trim();
    });
    return data;
  }

  function save(extra) {
    if (!form()) return null;
    const prev = read() || {};
    const draft = Object.assign({}, prev, collect(), extra || {});
    if (!draft.draftId) draft.draftId = genId();
    draft.lang = document.documentElement.lang || CONFIG.defaultLang;
    draft.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch (_) {}
    return draft;
  }

  function setStep(step) {
    const prev = read() || {};
    save({ furthestStep: Math.max(prev.furthestStep || 0, step || 0) });
  }

  function getId() {
    const d = read();
    return (d && d.draftId) || "";
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (_) {}
    lastSentHash = "";
  }

  /* Teil-Lead an den Server senden. Nur wenn:
     - CONFIG.partialCapture aktiv ist,
     - ein Kontaktkanal (E-Mail oder Telefon) vorliegt (sonst kein Nachfassen möglich),
     - ein echter Endpoint gesetzt ist (Demo-Platzhalter -> kein Versand).
     Dubletten werden über einen Hash vermieden. */
  function sendPartial(reason, useBeacon) {
    if (!CONFIG.partialCapture) return;
    const draft = save();
    if (!draft) return;
    const hasContact = !!((draft.email && draft.email.length) || (draft.phone && draft.phone.length));
    if (!hasContact) return;
    const endpoint = CONFIG.partialEndpoint || CONFIG.formEndpoint;
    if (!endpoint || /^REPLACE_/.test(endpoint)) return;
    const hash = JSON.stringify({ e: draft.email, p: draft.phone, s: draft.furthestStep });
    if (hash === lastSentHash) return;
    lastSentHash = hash;
    const body = JSON.stringify(Object.assign({}, draft, { partial: true, reason: reason || "auto" }));
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body,
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  }

  return { read, save, setStep, getId, clear, sendPartial, FIELD_IDS };
})();

/* Autosave bei Eingabe, Resume beim Laden, Teil-Lead beim Verlassen der Seite. */
function initLeadDraft() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  // Resume: gespeicherte Eingaben wiederherstellen (ausser bereits abgeschickt).
  const draft = LeadDraft.read();
  if (draft) {
    LeadDraft.FIELD_IDS.forEach((id) => {
      const el = form.elements[id];
      if (el && !el.value && draft[id]) el.value = draft[id];
    });
  }

  // Laufendes Autosave bei jeder Eingabe.
  form.addEventListener("input", () => LeadDraft.save());
  form.addEventListener("change", () => LeadDraft.save());

  // Beim Verlassen/Verstecken der Seite: Teil-Lead per Beacon (falls aktiviert).
  window.addEventListener("pagehide", () => LeadDraft.sendPartial("unload", true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") LeadDraft.sendPartial("hidden", true);
  });
}

/* ============================================================
   6) Formular-Submit
   ============================================================ */
function initForm() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");
  const successEl = document.getElementById("formSuccess");
  let isSubmitting = false;

  // Fehler-State erst bei Blur
  ["firstName", "lastName", "phone", "email", "zip", "dueDate"].forEach((id) => {
    const input = form.elements[id];
    if (input) input.addEventListener("blur", () => validateField(input));
  });
  const privacy = form.elements["privacy"];
  if (privacy) privacy.addEventListener("change", () => validateField(privacy));

  // Wunsch-Krankenkasse: Dropdown nur bei aktivierter Checkbox zeigen
  const keepInsurer = form.elements["keepInsurer"];
  const insurerWrap = document.getElementById("insurerWrap");
  const insurerSelect = form.elements["insurer"];
  if (keepInsurer && insurerWrap) {
    function syncInsurer() {
      const on = keepInsurer.checked;
      insurerWrap.hidden = !on;
      keepInsurer.setAttribute("aria-expanded", on ? "true" : "false");
      if (!on && insurerSelect) insurerSelect.value = "";
      if (on && insurerSelect) setTimeout(() => insurerSelect.focus(), 60);
    }
    keepInsurer.addEventListener("change", syncInsurer);
    // Resume: war zuvor eine Krankenkasse gewaehlt, Block wieder aufklappen
    if (insurerSelect && insurerSelect.value) {
      keepInsurer.checked = true;
      insurerWrap.hidden = false;
      keepInsurer.setAttribute("aria-expanded", "true");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Doppel-Submit verhindern

    // Honeypot: bei Befüllung still verwerfen (Erfolg vortäuschen, nichts senden)
    if (form.elements["company"] && form.elements["company"].value.trim() !== "") {
      showSuccess();
      return;
    }

    if (statusEl) { statusEl.hidden = true; statusEl.classList.remove("is-error"); }

    if (!validateForm(form)) return;

    // Loading-State
    isSubmitting = true;
    submitBtn.classList.add("is-loading");
    submitBtn.setAttribute("aria-busy", "true");

    // Daten sammeln (KEINE Personendaten in URL, reiner POST-Body)
    const payload = {
      firstName: form.elements["firstName"].value.trim(),
      lastName: form.elements["lastName"].value.trim(),
      phone: form.elements["phone"].value.trim(),
      email: form.elements["email"].value.trim(),
      zip: form.elements["zip"].value.trim(),
      ort: form.elements["ort"] ? form.elements["ort"].value.trim() : "",
      dueDate: form.elements["dueDate"].value,
      address: form.elements["address"] ? form.elements["address"].value.trim() : "",
      keepInsurer: form.elements["keepInsurer"] ? form.elements["keepInsurer"].checked : false,
      insurer: form.elements["insurer"] ? form.elements["insurer"].value : "",
      privacyConsent: form.elements["privacy"].checked,
      draftId: LeadDraft.getId(),
      lang: document.documentElement.lang,
      submittedAt: new Date().toISOString()
    };

    try {
      // Wenn Endpoint noch Platzhalter ist: Demo-Erfolg ohne echten Request
      if (!CONFIG.formEndpoint || /^REPLACE_/.test(CONFIG.formEndpoint)) {
        await new Promise((r) => setTimeout(r, 600));
        onSubmitSuccess();
        return;
      }

      // Web3Forms erwartet access_key im Body; aussagekraeftiger Betreff/Absender
      const body = Object.assign({}, payload, {
        access_key: CONFIG.web3formsKey,
        subject: "Neue Anmeldung: " + payload.firstName + " " + payload.lastName,
        from_name: "Express Vorgeburtlich"
      });

      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Request failed: " + res.status);
      onSubmitSuccess();
    } catch (err) {
      // Freundliche Fehlermeldung + Retry möglich
      isSubmitting = false;
      submitBtn.classList.remove("is-loading");
      submitBtn.removeAttribute("aria-busy");
      if (statusEl) {
        statusEl.textContent = t("status.error");
        statusEl.classList.add("is-error");
        statusEl.hidden = false;
      }
    }
  });

  function onSubmitSuccess() {
    // Tracking-Hook feuern (Platzhalter, standardmässig No-Op)
    try { CONFIG.onLeadSuccess(); } catch (_) {}
    LeadDraft.clear(); // abgeschlossen -> Entwurf entfernen
    showSuccess();
  }

  function showSuccess() {
    form.hidden = true;
    const bar = document.getElementById("wizardBar");
    if (bar) bar.style.width = "100%";
    if (successEl) {
      successEl.hidden = false;
      successEl.focus && successEl.focus();
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

/* ============================================================
   6b) Mehrstufiges Formular (Wizard): Foot-in-the-door + Endowed Progress
   ============================================================ */
function initWizard() {
  const form = document.getElementById("leadForm");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll(".form-step"));
  if (!steps.length) return;

  const bar = document.getElementById("wizardBar");
  const stepNow = document.getElementById("wizardStepNow");
  const progressText = document.getElementById("wizardProgressText");
  const total = steps.length;

  // Endowed-Progress: startet sichtbar bei ~20 %, nicht bei 0 %
  const PROG = [20, 45, 70, 92];
  // Pflichtfelder je Schritt (Index 0-basiert)
  const stepFields = {
    0: ["dueDate"],
    1: ["zip"],
    2: ["firstName", "lastName"],
    3: ["phone", "email", "privacy"]
  };
  let current = 0;

  function show(i) {
    current = i;
    steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    if (bar) bar.style.width = (PROG[i] || 20) + "%";
    if (stepNow) stepNow.textContent = String(i + 1);
    if (progressText) {
      progressText.textContent = t("wizard.progress")
        .replace("{step}", String(i + 1))
        .replace("{total}", String(total));
    }
    const focusEl = steps[i].querySelector("input, select, textarea");
    if (focusEl) setTimeout(() => focusEl.focus(), 60);
  }

  function validateStep(i) {
    let ok = true;
    (stepFields[i] || []).forEach((id) => {
      const input = form.elements[id];
      if (input && !validateField(input)) ok = false;
    });
    return ok;
  }

  form.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateStep(current)) return;
      if (current < total - 1) {
        show(current + 1);
        LeadDraft.setStep(current);      // weitesten erreichten Schritt merken
        LeadDraft.sendPartial("step");   // Teil-Lead (falls aktiviert & Kontakt vorhanden)
      }
    });
  });
  form.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (current > 0) show(current - 1);
    });
  });

  // Sprachwechsel: Fortschrittstext neu setzen
  document.addEventListener("ev:lang", () => {
    if (progressText) {
      progressText.textContent = t("wizard.progress")
        .replace("{step}", String(current + 1))
        .replace("{total}", String(total));
    }
  });

  // Resume: zum weitesten zuvor erreichten Schritt springen (Eingaben sind
  // bereits via initLeadDraft wiederhergestellt). Sonst Start bei Schritt 1.
  const saved = LeadDraft.read();
  const resumeAt = saved && Number.isInteger(saved.furthestStep)
    ? Math.min(Math.max(saved.furthestStep, 0), total - 1)
    : 0;
  show(resumeAt);
}

/* ============================================================
   6c) Geburtstermin: Countdown + persönliche Anmelde-Timeline (Reziprozität)
   ============================================================ */
function initDueDate() {
  const form = document.getElementById("leadForm");
  if (!form) return;
  const input = form.elements["dueDate"];
  const result = document.getElementById("dueResult");
  const badge = document.getElementById("countdownBadge");
  const timeline = document.getElementById("timeline");
  if (!input || !result) return;

  function render() {
    const val = input.value;
    if (!val) { result.hidden = true; return; }
    const target = new Date(val + "T00:00:00");
    if (isNaN(target.getTime())) { result.hidden = true; return; }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((target - today) / 86400000);
    const weeks = Math.max(0, Math.round(days / 7));

    let msg;
    if (days > 0) {
      msg = t("wizard.cdWeeks").replace("{weeks}", String(weeks));
    } else if (days === 0) {
      msg = t("wizard.cdNow");
    } else {
      msg = t("wizard.cdPast");
    }

    if (badge) {
      badge.innerHTML =
        '<svg class="ic" aria-hidden="true"><use href="#i-clock"></use></svg>' +
        '<span></span>';
      badge.querySelector("span").textContent = msg;
    }

    if (timeline) {
      const items = [
        { now: days > 0, when: t("timeline.i1t"), what: t("timeline.i1d") },
        { now: false, when: t("timeline.i2t"), what: t("timeline.i2d") },
        { now: false, when: t("timeline.i3t"), what: t("timeline.i3d") },
        { now: false, when: t("timeline.i4t"), what: t("timeline.i4d") }
      ];
      timeline.innerHTML =
        '<p class="timeline-title"></p><ul class="timeline-list"></ul>';
      timeline.querySelector(".timeline-title").textContent = t("timeline.title");
      const ul = timeline.querySelector(".timeline-list");
      items.forEach((it) => {
        const li = document.createElement("li");
        li.className = "timeline-item" + (it.now ? " is-now" : "");
        const when = document.createElement("div");
        when.className = "timeline-when";
        when.textContent = it.when;
        const what = document.createElement("div");
        what.className = "timeline-what";
        what.textContent = it.what;
        li.appendChild(when);
        li.appendChild(what);
        ul.appendChild(li);
      });
    }

    result.hidden = false;
  }

  input.addEventListener("change", render);
  input.addEventListener("input", render);
  document.addEventListener("ev:lang", render);
  render(); // wiederhergestellten Termin sofort anzeigen
}

/* ============================================================
   6d) Reibung senken: PLZ → Ort automatisch (nur PLZ, keine Personendaten)
   ============================================================ */
function initZipLookup() {
  const form = document.getElementById("leadForm");
  if (!form) return;
  const zip = form.elements["zip"];
  const ort = form.elements["ort"];
  const ortOptions = document.getElementById("ortOptions");
  if (!zip || !ort) return;
  let lastLookup = "";
  let autoFilled = false; // wurde der Ort automatisch gesetzt?

  // Tippt der Nutzer den Ort selbst, nicht mehr ueberschreiben/leeren
  ort.addEventListener("input", () => { autoFilled = false; });

  function clearOptions() {
    if (ortOptions) ortOptions.innerHTML = "";
  }

  // Bei mehreren Ortschaften pro PLZ: Hauptort bevorzugen (Name == Gemeindename)
  function pickPrimary(localities) {
    const main = localities.find(
      (l) => l.name && l.commune && l.name === (l.commune.shortName || l.commune.name)
    );
    return (main || localities[0]).name;
  }

  zip.addEventListener("input", () => {
    const v = zip.value.trim();

    // PLZ unvollstaendig: automatisch gesetzten Ort wieder entfernen
    if (!/^\d{4}$/.test(v)) {
      lastLookup = "";
      clearOptions();
      if (autoFilled) { ort.value = ""; autoFilled = false; }
      return;
    }

    if (v === lastLookup) return;
    lastLookup = v;

    fetch("https://openplzapi.org/ch/Localities?postalCode=" + v)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (zip.value.trim() !== v) return; // PLZ hat sich inzwischen geaendert
        if (Array.isArray(data) && data.length) {
          // Eindeutige Ortsnamen fuer die Auswahlliste
          const names = [...new Set(data.map((l) => l.name).filter(Boolean))];
          clearOptions();
          if (ortOptions) {
            names.forEach((n) => {
              const opt = document.createElement("option");
              opt.value = n;
              ortOptions.appendChild(opt);
            });
          }
          // Nur ueberschreiben, wenn Feld leer oder zuvor automatisch gefuellt
          if (!ort.value.trim() || autoFilled) {
            ort.value = pickPrimary(data);
            autoFilled = true;
          }
        } else {
          clearOptions();
          if (autoFilled) { ort.value = ""; autoFilled = false; }
        }
      })
      .catch(() => { /* still: kein Blocker bei Netzfehler */ });
  });
}

/* ============================================================
   6e) Exit-Intent: freundlicher Reminder, keine Falle
   ============================================================ */
function initExitIntent() {
  const form = document.getElementById("leadForm");
  const modal = document.getElementById("exitModal");
  if (!form || !modal) return;

  function open() {
    if (sessionStorage.getItem("ev_exit_shown")) return;
    if (form.hidden) return; // bereits abgeschickt
    const due = form.elements["dueDate"];
    if (due && due.value) return; // Termin schon eingetragen -> kein Reminder
    sessionStorage.setItem("ev_exit_shown", "1");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    LeadDraft.sendPartial("exit", true); // Abbruch-Signal: Teil-Lead (falls aktiviert)
  }
  function close() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  document.addEventListener("mouseout", (e) => {
    if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) open();
  });

  modal.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", close)
  );
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  const focusBtn = modal.querySelector("[data-focus-form]");
  if (focusBtn) {
    focusBtn.addEventListener("click", () => {
      close();
      const formCard = document.getElementById("formular");
      if (formCard) formCard.scrollIntoView({ behavior: "smooth", block: "start" });
      const due = form.elements["dueDate"];
      if (due) setTimeout(() => due.focus(), 400);
    });
  }
}

/* ============================================================
   7) UI: Sprachumschalter, Mobile-Nav, Sticky-CTA
   ============================================================ */
function initUI() {
  // Sprachumschalter
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  // Mobile-Nav-Toggle
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      })
    );
  }

  // Sticky-CTA: einblenden, sobald Hero-Formular ausser Sicht (nur Mobile relevant)
  const sticky = document.getElementById("stickyCta");
  const formCard = document.getElementById("formular");
  if (sticky && formCard && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sticky.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { rootMargin: "0px 0px -40% 0px" }
    );
    io.observe(formCard);
  }
}

/* ============================================================
   8) Consent (revDSG): Statistik & Marketing laden NUR nach Einwilligung
   ============================================================ */
const Consent = (function () {
  const KEY = "ev_consent";

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (v && typeof v === "object") return v;
    } catch (e) { /* ignore */ }
    return null;
  }

  function save(stats, marketing) {
    const v = { set: true, stats: !!stats, marketing: !!marketing, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* ignore */ }
    return v;
  }

  // Tatsaechliches Laden der Dienste anhand der Einwilligung
  function apply(v) {
    if (!v) return;
    if (v.marketing) loadPixel();
    if (v.stats) loadAnalytics();
  }

  // --- Meta-Pixel (nur bei Marketing-Einwilligung) ---
  let pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded || !CONFIG.metaPixelId) return;
    pixelLoaded = true;
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
  }

  // --- Google Analytics (nur bei Statistik-Einwilligung) ---
  let gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded || !CONFIG.gaMeasurementId) return;
    gaLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.gaMeasurementId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaMeasurementId, { anonymize_ip: true });
  }

  return { read, save, apply, hasMarketing: () => !!(read() && read().marketing), hasStats: () => !!(read() && read().stats) };
})();

function initConsent() {
  const banner = document.getElementById("consent");
  if (!banner) return;

  const stored = Consent.read();
  if (stored && stored.set) {
    // Einwilligung liegt vor: Banner aus, Dienste laden
    Consent.apply(stored);
    return;
  }

  const options   = document.getElementById("consentOptions");
  const cbStats   = document.getElementById("consentStats");
  const cbMarket  = document.getElementById("consentMarketing");
  const btnAccept = document.getElementById("consentAccept");
  const btnReject = document.getElementById("consentReject");
  const btnCustom = document.getElementById("consentCustomize");
  const btnSave   = document.getElementById("consentSave");

  banner.hidden = false;

  function close(stats, marketing) {
    const v = Consent.save(stats, marketing);
    Consent.apply(v);
    banner.hidden = true;
  }

  if (btnAccept) btnAccept.addEventListener("click", () => close(true, true));
  if (btnReject) btnReject.addEventListener("click", () => close(false, false));
  if (btnCustom) btnCustom.addEventListener("click", () => {
    if (options) options.hidden = false;
    if (btnSave) btnSave.hidden = false;
    btnCustom.hidden = true;
  });
  if (btnSave) btnSave.addEventListener("click", () => {
    close(cbStats && cbStats.checked, cbMarket && cbMarket.checked);
  });
}

/* ============================================================
   9) Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setLanguage(getInitialLang());
  initUI();
  initLeadDraft();
  initForm();
  initWizard();
  initDueDate();
  initZipLookup();
  initExitIntent();
  initConsent();
});
