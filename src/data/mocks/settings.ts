import { temporaryWixAsset } from "@/data/mocks/media";
import type { SiteSettings } from "@/types/content";

export const mockSiteSettings: SiteSettings = {
  brandName: "Vassilena Papakostopoulos",
  heroHeading: {
    en: "VisualStudio",
    bg: "VisualStudio",
  },
  heroSubheading: {
    en: "Interior Design, Consultation and 3D Visualisation Services",
    bg: "Интериорен дизайн, консултации и 3D визуализация",
  },
  aboutHeading: {
    en: "About",
    bg: "За мен",
  },
  aboutSummary: {
    en: "Interior designer & 3D visualizer focused on calm, functional and balanced spaces.",
    bg: "Интериорен дизайнер и 3D визуализатор с фокус върху спокойни, функционални и балансирани пространства.",
  },
  aboutBody: {
    en: "I am an interior designer and 3D visualizer working with a strong focus on clarity, functionality and emotional comfort. My work is guided by the idea that interiors should support everyday life, create calm and feel intuitive rather than overwhelming.\n\nI approach each project as a thoughtful process — from spatial layout and material selection to light, proportions and atmosphere. Whether working on a full interior concept or a single space, my goal is to create environments that feel coherent, timeless and personal. My design philosophy is rooted in balance, simplicity and a deep respect for the human experience within space. I am particularly drawn to natural materials, soft color palettes and clean architectural lines, allowing interiors to feel both elegant and grounded.",
    bg: "Аз съм интериорен дизайнер и 3D визуализатор с фокус върху яснота, функционалност и емоционален комфорт. Работата ми е водена от идеята, че интериорът трябва да подкрепя ежедневието, да създава спокойствие и да се усеща интуитивно, а не претрупано.\n\nВсеки проект подхождам като към внимателен процес — от планиране на пространството и избор на материали до светлина, пропорции и атмосфера. Целта ми е да създавам среди, които се усещат цялостни, вечни и лични. Философията ми е вкоренена в баланса, простотата и уважението към човешкото преживяване в пространството.",
  },
  contactHeading: {
    en: "Get in touch",
    bg: "Свържете се",
  },
  contactIntro: {
    en: "Tell me about your space and how I can help.",
    bg: "Разкажете ми за вашето пространство и как мога да помогна.",
  },
  phone: "00359 894715123",
  email: "papakostopoulosvs@mail.bg",
  location: {
    en: "North-West Bulgaria",
    bg: "Северозападна България",
  },
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  surveyUrl: "https://papakostopoulosvs.wixsite.com/portfolio",
  logo: temporaryWixAsset(
    "logo",
    "8a77d8_e1ca566d2cb94082bf74c562009b37a3~mv2.png",
    "Vassilena Papakostopoulos",
    "Василена Папакостопулос",
    240,
    240,
  ),
  heroImage: temporaryWixAsset(
    "hero",
    "8a77d8_8e03881a880541beaaf621b2654edf31~mv2.png",
    "Interior design visualisation",
    "Визуализация на интериорен дизайн",
    1600,
    2100,
  ),
  aboutImage: temporaryWixAsset(
    "about",
    "8a77d8_74b19c928d384f098a3ccd76864aa169~mv2.png",
    "Portrait of Vassilena Papakostopoulos",
    "Портрет на Василена Папакостопулос",
    1260,
    1024,
  ),
};
