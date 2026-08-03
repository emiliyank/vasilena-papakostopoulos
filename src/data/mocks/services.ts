import type { Service } from "@/types/content";

export const mockServices: Service[] = [
  {
    id: "svc-interior-design",
    slug: "interior-design",
    status: "published",
    order: 1,
    title: { en: "Interior Design", bg: "Интериорен дизайн" },
    shortDescription: {
      en: "Concept-driven interior design tailored to your lifestyle.",
      bg: "Концептуален интериорен дизайн, съобразен с вашия начин на живот.",
    },
    fullDescription: {
      en: "This service includes the development of a complete interior concept — spatial planning, materials, finishes, color palettes and overall design direction. Each project is approached individually, with attention to functionality, aesthetics and the way the space will be experienced in daily life.\n\nThe result is a coherent, well-balanced interior concept that can be further developed or executed.",
      bg: "Услугата включва разработване на цялостна интериорна концепция — планиране на пространството, материали, покрития, цветови палитри и обща дизайн посока. Всеки проект се подхожда индивидуално, с внимание към функционалност, естетика и начина, по който пространството се преживява в ежедневието.",
    },
  },
  {
    id: "svc-consultation",
    slug: "consultation",
    status: "published",
    order: 2,
    title: { en: "Consultation", bg: "Консултация" },
    shortDescription: {
      en: "For clients seeking clarity and professional guidance.",
      bg: "За клиенти, които търсят яснота и професионална насока.",
    },
    fullDescription: {
      en: "Interior consultation is suitable when you need expert input without a full design package. This service focuses on layout improvement, material selection, color schemes, lighting advice and functional solutions tailored to your space.\n\nConsultations can be provided online or on-site, depending on the project scope.",
      bg: "Интериорната консултация е подходяща, когато имате нужда от експертна помощ без пълен дизайн пакет. Фокусът е върху подобряване на разпределението, избор на материали, цветови схеми, осветление и функционални решения.",
    },
  },
  {
    id: "svc-3d-visualization",
    slug: "3d-visualization",
    status: "published",
    order: 3,
    title: { en: "3D Visualization", bg: "3D визуализация" },
    shortDescription: {
      en: "Photorealistic 3D visuals for clear communication and presentation.",
      bg: "Фотореалистични 3D визуализации за ясна комуникация и представяне.",
    },
    fullDescription: {
      en: "3D visualization is ideal for clients, developers or designers who need realistic imagery to present or test design ideas before execution. The focus is on accurate proportions, lighting, materials and atmosphere.\n\nThis service helps translate concepts into clear visual narratives, supporting confident decision-making.",
      bg: "3D визуализацията е подходяща за клиенти, инвеститори или дизайнери, които имат нужда от реалистични изображения преди изпълнение. Фокусът е върху точни пропорции, светлина, материали и атмосфера.",
    },
  },
  {
    id: "svc-furniture-design",
    slug: "furniture-design",
    status: "published",
    order: 4,
    title: { en: "Furniture design", bg: "Дизайн на мебели" },
    shortDescription: {
      en: "Each project is created individually for the specific space, style, and client requirements.",
      bg: "Всеки проект се създава индивидуално според пространството, стила и изискванията на клиента.",
    },
    fullDescription: {
      en: "Client benefits include optimal use of space, personalized design tailored to lifestyle, and detailed technical drawings ready for production.",
      bg: "Предимствата включват оптимално използване на пространството, персонализиран дизайн и подробни технически чертежи, готови за производство.",
    },
  },
  {
    id: "svc-styling",
    slug: "interior-styling-home-staging",
    status: "published",
    order: 5,
    title: {
      en: "Interior Styling and Home Staging",
      bg: "Интериорен стайлинг и хоумстейджинг",
    },
    shortDescription: {
      en: "The final stage in creating a truly complete interior.",
      bg: "Финален етап в създаването на наистина завършен интериор.",
    },
    fullDescription: {
      en: "Through the thoughtful selection and composition of furniture, decorative objects, textiles, lighting, artwork, plants, and accessories, every interior is refined to reflect its architecture, purpose, and the personality of its owner.",
      bg: "Чрез внимателен подбор и композиция на мебели, декоративни обекти, текстил, осветление, произведения на изкуството, растения и аксесоари всеки интериор се доизгражда така, че да отразява архитектурата, предназначението и личността на собственика.",
    },
  },
];
