import type { PriceItem, PricesPageContent } from "@/types/content";

export const mockPricesPageContent: PricesPageContent = {
  heading: {
    en: "Package prices",
    bg: "Пакетни цени",
  },
  intro: {
    en: "The prices shown are indicative. The final cost depends on the complexity and level of detail of the project, specific client requirements, and other factors.",
    bg: "Представените цени са ориентировъчни. Крайната стойност зависи от сложността и детайлността на обекта, специфични изисквания на клиента и др.",
  },
  paymentHeading: {
    en: "Payment terms",
    bg: "Условия на плащане",
  },
  paymentTerms: [
    {
      en: "Advance payment — 50%",
      bg: "Аванс - 50%",
    },
    {
      en: "Final payment — upon project delivery",
      bg: "Окончателно плащане - при предаване на проекта",
    },
  ],
};

export const mockPrices: PriceItem[] = [
  {
    id: "price-home",
    status: "published",
    order: 1,
    name: { en: "Home", bg: "Home" },
    description: {
      en: "Essential planning package for clarifying layout and built-in furniture direction.",
      bg: "Основен пакет за изясняване на разпределението и посоката на корпусната мебел.",
    },
    priceDisplay: { en: "On request", bg: "При запитване" },
    features: [
      {
        en: "Initial consultation, site visit and measuring of the rooms",
        bg: "Първоначална консултация, посещение и заснемане на помещенията.",
      },
      {
        en: "Functional 2D layout",
        bg: "Функционално разпределение 2D",
      },
      {
        en: "Summarized 3D drawings of the built-in furniture",
        bg: "Обобщени 3D чертежи на корпусната мебел",
      },
      {
        en: "Placement of sockets, sensors, switches and plumbing points",
        bg: "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
      },
    ],
  },
  {
    id: "price-basic",
    status: "published",
    order: 2,
    name: { en: "Basic package", bg: "Базов пакет" },
    description: {
      en: "Planning package with detailed furniture drawings and concept visuals.",
      bg: "Пакет с детайлни чертежи на мебели и идейни визуализации.",
    },
    priceDisplay: { en: "7 EUR/m²", bg: "7 Евро/м2" },
    features: [
      {
        en: "Initial consultation, site visit and measuring of the rooms",
        bg: "Първоначална консултация, посещение и заснемане на помещенията.",
      },
      {
        en: "Functional 2D layout",
        bg: "Функционално разпределение 2D",
      },
      {
        en: "Detailed working drawings for custom built-in furniture",
        bg: "Детайлни работни чертежи на корпусна мебел която ще бъде по поръчка.",
      },
      {
        en: "Placement of sockets, sensors, switches and plumbing points",
        bg: "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
      },
      {
        en: "Concept design — photorealistic renders, including 3D furniture models, lighting and material selection. Up to 4 views and 2 colour variants.",
        bg: "Идеен проект – фотореалистични рендери. Включва изработката на 3D модели на мебелите, осветление и избор на материали. До 4 изгледа и 2 цветови варианта.",
      },
    ],
  },
  {
    id: "price-standard",
    status: "published",
    order: 3,
    name: { en: "Standard package", bg: "Стандартен пакет" },
    description: {
      en: "Full concept package with detailed drawings, visuals and design supervision.",
      bg: "Пълен идеен пакет с детайлни чертежи, визуализации и авторски надзор.",
    },
    priceDisplay: { en: "18 EUR/m²", bg: "18 Евро/м2" },
    features: [
      {
        en: "Initial consultation, site visit and measuring of the rooms",
        bg: "Първоначална консултация, посещение и заснемане на помещенията.",
      },
      {
        en: "Functional 2D layout",
        bg: "Функционално разпределение 2D",
      },
      {
        en: "Detailed working drawings for custom built-in furniture",
        bg: "Детайлни работни чертежи на корпусна мебел която ще бъде по поръчка.",
      },
      {
        en: "Placement of sockets, sensors, switches and plumbing points",
        bg: "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
      },
      {
        en: "Concept design — photorealistic renders, including 3D furniture models, lighting and material selection. Up to 4 views and 2 colour variants.",
        bg: "Идеен проект – фотореалистични рендери. Включва изработката на 3D модели на мебелите, осветление и избор на материали. До 4 изгледа и 2 цветови варианта.",
      },
      {
        en: "Author's supervision",
        bg: "Авторски надзор",
      },
    ],
  },
  {
    id: "price-premium",
    status: "published",
    order: 4,
    name: { en: "Premium package", bg: "Премиум пакет" },
    description: {
      en: "Extended package for complex projects requiring a higher level of detail.",
      bg: "Разширен пакет за сложни обекти, изискващи по-висока степен на детайлност.",
    },
    priceDisplay: { en: "50 EUR/m²", bg: "50 Евро/м2" },
    features: [],
  },
];
