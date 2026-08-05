#!/usr/bin/env node

/**
 * Seed Airtable tables from the website mock content.
 *
 * Requires:
 *   AIRTABLE_BASE_ID
 *   A write-capable PAT in AIRTABLE_SEED_PAT, AIRTABLE_SETUP_PAT, or AIRTABLE_PAT
 *   Scopes: data.records:write (+ read is fine)
 *
 * Safety:
 *   Dry-run by default. Pass --apply to create records.
 *   Skips records when a matching Slug / Internal Name already exists.
 *   Never deletes records.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APPLY = process.argv.includes("--apply");
const baseId = process.env.AIRTABLE_BASE_ID;
const pat =
  process.env.AIRTABLE_SEED_PAT ||
  process.env.AIRTABLE_PAT ||
  process.env.AIRTABLE_SETUP_PAT;

const blogPosts = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../src/data/seeds/blog-posts.json"),
    "utf8",
  ),
);

if (!baseId || !/^app[A-Za-z0-9]+$/.test(baseId)) {
  fail("Missing or invalid AIRTABLE_BASE_ID.");
}
if (!pat) {
  fail(
    "Missing token. Prefer AIRTABLE_SEED_PAT with data.records:write (and read). Falls back to AIRTABLE_PAT.",
  );
}

const tokenSource = process.env.AIRTABLE_SEED_PAT
  ? "AIRTABLE_SEED_PAT"
  : process.env.AIRTABLE_PAT
    ? "AIRTABLE_PAT"
    : "AIRTABLE_SETUP_PAT";

const TABLES = {
  projects: process.env.AIRTABLE_TABLE_PROJECTS || "Projects",
  projectImages: process.env.AIRTABLE_TABLE_PROJECT_IMAGES || "Project Images",
  services: process.env.AIRTABLE_TABLE_SERVICES || "Services",
  blogPosts: process.env.AIRTABLE_TABLE_BLOG_POSTS || "Blog Posts",
  prices: process.env.AIRTABLE_TABLE_PRICES || "Prices",
  siteSettings: process.env.AIRTABLE_TABLE_SITE_SETTINGS || "Site Settings",
};

function wixUrl(mediaId, width = 1600, height = 2000) {
  return `https://static.wixstatic.com/media/${mediaId}/v1/fit/w_${width},h_${height},q_90/${mediaId}`;
}

function attachment(url) {
  return [{ url }];
}

const LOGO_URL =
  "https://static.wixstatic.com/media/8a77d8_e1ca566d2cb94082bf74c562009b37a3~mv2.png/v1/fill/w_256,h_256,al_c,q_90/8a77d8_e1ca566d2cb94082bf74c562009b37a3~mv2.png";

const covers = [
  "8a77d8_8e03881a880541beaaf621b2654edf31~mv2.png",
  "8a77d8_1962249a003c483d88ecd88f30677bf3~mv2.png",
  "8a77d8_01657f5e88f74fddaa71b2e0bad02633~mv2.png",
  "8a77d8_f429eac970024fbcbfc6d8b945bdd96b~mv2.png",
  "8a77d8_a3b682e098754633a755c1266b80d583~mv2.png",
  "8a77d8_d698b76ef779423492a3d4739cefceb7~mv2.png",
  "8a77d8_c8734f6fbd184432bd2221d37a18aae1~mv2.jpg",
  "8a77d8_2f2a39c934264d229e39ec9a6ec6d970~mv2.png",
];

const ATMOSPHERE = "8a77d8_b315c66d6bd94ce78f53b2158aef8b16~mv2.png";
const ABOUT = "8a77d8_74b19c928d384f098a3ccd76864aa169~mv2.png";

const siteSettings = {
  "Internal Name": "Production",
  Active: true,
  "Brand Name": "Vassilena Papakostopoulos",
  "Hero Heading EN": "VisualStudio",
  "Hero Heading BG": "VisualStudio",
  "Hero Subheading EN":
    "Interior Design, Consultation and 3D Visualisation Services",
  "Hero Subheading BG": "Интериорен дизайн, консултации и 3D визуализация",
  "About Heading EN": "About",
  "About Heading BG": "За мен",
  "About Summary EN":
    "Interior designer & 3D visualizer focused on calm, functional and balanced spaces.",
  "About Summary BG":
    "Интериорен дизайнер и 3D визуализатор с фокус върху спокойни, функционални и балансирани пространства.",
  "About Body EN":
    "I am an interior designer and 3D visualizer working with a strong focus on clarity, functionality and emotional comfort. My work is guided by the idea that interiors should support everyday life, create calm and feel intuitive rather than overwhelming.\n\nI approach each project as a thoughtful process — from spatial layout and material selection to light, proportions and atmosphere. Whether working on a full interior concept or a single space, my goal is to create environments that feel coherent, timeless and personal. My design philosophy is rooted in balance, simplicity and a deep respect for the human experience within space. I am particularly drawn to natural materials, soft color palettes and clean architectural lines, allowing interiors to feel both elegant and grounded.",
  "About Body BG":
    "Аз съм интериорен дизайнер и 3D визуализатор с фокус върху яснота, функционалност и емоционален комфорт. Работата ми е водена от идеята, че интериорът трябва да подкрепя ежедневието, да създава спокойствие и да се усеща интуитивно, а не претрупано.\n\nВсеки проект подхождам като към внимателен процес — от планиране на пространството и избор на материали до светлина, пропорции и атмосфера. Целта ми е да създавам среди, които се усещат цялостни, вечни и лични. Философията ми е вкоренена в баланса, простотата и уважението към човешкото преживяване в пространството.",
  "Contact Heading EN": "Get in touch",
  "Contact Heading BG": "Свържете се",
  "Contact Intro EN": "Tell me about your space and how I can help.",
  "Contact Intro BG": "Разкажете ми за вашето пространство и как мога да помогна.",
  Phone: "00359 894715123",
  Email: "papakostopoulosvs@mail.bg",
  "Location EN": "North-West Bulgaria",
  "Location BG": "Северозападна България",
  "Instagram URL": "https://www.instagram.com/vassilenapapakostopoulos/",
  "Facebook URL": "https://www.facebook.com/vassilena.papakostopoulos/",
  "Survey URL":
    "https://docs.google.com/forms/d/10-k1YJ33jze-Rqq_tgzdT4KgvFDKSjsr1NXKvU7BsLo/viewform",
  Logo: attachment(LOGO_URL),
  "Hero Image": attachment(wixUrl(covers[0])),
  "About Image": attachment(wixUrl(ABOUT, 1260, 1024)),
  "Prices Heading EN": "Package prices",
  "Prices Heading BG": "Пакетни цени",
  "Prices Intro EN":
    "The prices shown are indicative. The final cost depends on the complexity and level of detail of the project, specific client requirements, and other factors.",
  "Prices Intro BG":
    "Представените цени са ориентировъчни. Крайната стойност зависи от сложността и детайлността на обекта, специфични изисквания на клиента и др.",
  "Payment Heading EN": "Payment terms",
  "Payment Heading BG": "Условия на плащане",
  "Payment Terms EN": "Advance payment — 50%\nFinal payment — upon project delivery",
  "Payment Terms BG": "Аванс - 50%\nОкончателно плащане - при предаване на проекта",
};

const services = [
  {
    "Internal Name": "Interior Design",
    Slug: "interior-design",
    Status: "Published",
    Order: 1,
    "Title EN": "Interior Design",
    "Title BG": "Интериорен дизайн",
    "Short Description EN":
      "Concept-driven interior design tailored to your lifestyle.",
    "Short Description BG":
      "Концептуален интериорен дизайн, съобразен с вашия начин на живот.",
    "Full Description EN":
      "This service includes the development of a complete interior concept — spatial planning, materials, finishes, color palettes and overall design direction. Each project is approached individually, with attention to functionality, aesthetics and the way the space will be experienced in daily life.\n\nThe result is a coherent, well-balanced interior concept that can be further developed or executed.",
    "Full Description BG":
      "Услугата включва разработване на цялостна интериорна концепция — планиране на пространството, материали, покрития, цветови палитри и обща дизайн посока. Всеки проект се подхожда индивидуално, с внимание към функционалност, естетика и начина, по който пространството се преживява в ежедневието.",
  },
  {
    "Internal Name": "Consultation",
    Slug: "consultation",
    Status: "Published",
    Order: 2,
    "Title EN": "Consultation",
    "Title BG": "Консултация",
    "Short Description EN": "For clients seeking clarity and professional guidance.",
    "Short Description BG": "За клиенти, които търсят яснота и професионална насока.",
    "Full Description EN":
      "Interior consultation is suitable when you need expert input without a full design package. This service focuses on layout improvement, material selection, color schemes, lighting advice and functional solutions tailored to your space.\n\nConsultations can be provided online or on-site, depending on the project scope.",
    "Full Description BG":
      "Интериорната консултация е подходяща, когато имате нужда от експертна помощ без пълен дизайн пакет. Фокусът е върху подобряване на разпределението, избор на материали, цветови схеми, осветление и функционални решения.",
  },
  {
    "Internal Name": "3D Visualization",
    Slug: "3d-visualization",
    Status: "Published",
    Order: 3,
    "Title EN": "3D Visualization",
    "Title BG": "3D визуализация",
    "Short Description EN":
      "Photorealistic 3D visuals for clear communication and presentation.",
    "Short Description BG":
      "Фотореалистични 3D визуализации за ясна комуникация и представяне.",
    "Full Description EN":
      "3D visualization is ideal for clients, developers or designers who need realistic imagery to present or test design ideas before execution. The focus is on accurate proportions, lighting, materials and atmosphere.\n\nThis service helps translate concepts into clear visual narratives, supporting confident decision-making.",
    "Full Description BG":
      "3D визуализацията е подходяща за клиенти, инвеститори или дизайнери, които имат нужда от реалистични изображения преди изпълнение. Фокусът е върху точни пропорции, светлина, материали и атмосфера.",
  },
  {
    "Internal Name": "Furniture design",
    Slug: "furniture-design",
    Status: "Published",
    Order: 4,
    "Title EN": "Furniture design",
    "Title BG": "Дизайн на мебели",
    "Short Description EN":
      "Each project is created individually for the specific space, style, and client requirements.",
    "Short Description BG":
      "Всеки проект се създава индивидуално според пространството, стила и изискванията на клиента.",
    "Full Description EN":
      "Client benefits include optimal use of space, personalized design tailored to lifestyle, and detailed technical drawings ready for production.",
    "Full Description BG":
      "Предимствата включват оптимално използване на пространството, персонализиран дизайн и подробни технически чертежи, готови за производство.",
  },
  {
    "Internal Name": "Interior Styling and Home Staging",
    Slug: "interior-styling-home-staging",
    Status: "Published",
    Order: 5,
    "Title EN": "Interior Styling and Home Staging",
    "Title BG": "Интериорен стайлинг и хоумстейджинг",
    "Short Description EN": "The final stage in creating a truly complete interior.",
    "Short Description BG": "Финален етап в създаването на наистина завършен интериор.",
    "Full Description EN":
      "Through the thoughtful selection and composition of furniture, decorative objects, textiles, lighting, artwork, plants, and accessories, every interior is refined to reflect its architecture, purpose, and the personality of its owner.",
    "Full Description BG":
      "Чрез внимателен подбор и композиция на мебели, декоративни обекти, текстил, осветление, произведения на изкуството, растения и аксесоари всеки интериор се доизгражда така, че да отразява архитектурата, предназначението и личността на собственика.",
  },
];

const prices = [
  {
    "Internal Name": "Home",
    Status: "Published",
    Order: 1,
    "Name EN": "Home",
    "Name BG": "Home",
    "Description EN":
      "Essential planning package for clarifying layout and built-in furniture direction.",
    "Description BG":
      "Основен пакет за изясняване на разпределението и посоката на корпусната мебел.",
    "Price Display EN": "On request",
    "Price Display BG": "При запитване",
    "Features EN": [
      "Initial consultation, site visit and measuring of the rooms",
      "Functional 2D layout",
      "Summarized 3D drawings of the built-in furniture",
      "Placement of sockets, sensors, switches and plumbing points",
    ].join("\n"),
    "Features BG": [
      "Първоначална консултация, посещение и заснемане на помещенията.",
      "Функционално разпределение 2D",
      "Обобщени 3D чертежи на корпусната мебел",
      "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
    ].join("\n"),
  },
  {
    "Internal Name": "Basic package",
    Status: "Published",
    Order: 2,
    "Name EN": "Basic package",
    "Name BG": "Базов пакет",
    "Description EN":
      "Planning package with detailed furniture drawings and concept visuals.",
    "Description BG": "Пакет с детайлни чертежи на мебели и идейни визуализации.",
    "Price Display EN": "7 EUR/m²",
    "Price Display BG": "7 Евро/м2",
    "Features EN": [
      "Initial consultation, site visit and measuring of the rooms",
      "Functional 2D layout",
      "Detailed working drawings for custom built-in furniture",
      "Placement of sockets, sensors, switches and plumbing points",
      "Concept design — photorealistic renders, including 3D furniture models, lighting and material selection. Up to 4 views and 2 colour variants.",
    ].join("\n"),
    "Features BG": [
      "Първоначална консултация, посещение и заснемане на помещенията.",
      "Функционално разпределение 2D",
      "Детайлни работни чертежи на корпусна мебел която ще бъде по поръчка.",
      "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
      "Идеен проект – фотореалистични рендери. Включва изработката на 3D модели на мебелите, осветление и избор на материали. До 4 изгледа и 2 цветови варианта.",
    ].join("\n"),
  },
  {
    "Internal Name": "Standard package",
    Status: "Published",
    Order: 3,
    "Name EN": "Standard package",
    "Name BG": "Стандартен пакет",
    "Description EN":
      "Full concept package with detailed drawings, visuals and design supervision.",
    "Description BG":
      "Пълен идеен пакет с детайлни чертежи, визуализации и авторски надзор.",
    "Price Display EN": "18 EUR/m²",
    "Price Display BG": "18 Евро/м2",
    "Features EN": [
      "Initial consultation, site visit and measuring of the rooms",
      "Functional 2D layout",
      "Detailed working drawings for custom built-in furniture",
      "Placement of sockets, sensors, switches and plumbing points",
      "Concept design — photorealistic renders, including 3D furniture models, lighting and material selection. Up to 4 views and 2 colour variants.",
      "Author's supervision",
    ].join("\n"),
    "Features BG": [
      "Първоначална консултация, посещение и заснемане на помещенията.",
      "Функционално разпределение 2D",
      "Детайлни работни чертежи на корпусна мебел която ще бъде по поръчка.",
      "Задаване на местоположение на контакти, сензори, ел. ключове, ВиК",
      "Идеен проект – фотореалистични рендери. Включва изработката на 3D модели на мебелите, осветление и избор на материали. До 4 изгледа и 2 цветови варианта.",
      "Авторски надзор",
    ].join("\n"),
  },
  {
    "Internal Name": "Premium package",
    Status: "Published",
    Order: 4,
    "Name EN": "Premium package",
    "Name BG": "Премиум пакет",
    "Description EN":
      "Extended package for complex projects requiring a higher level of detail.",
    "Description BG":
      "Разширен пакет за сложни обекти, изискващи по-висока степен на детайлност.",
    "Price Display EN": "50 EUR/m²",
    "Price Display BG": "50 Евро/м2",
    "Features EN": "",
    "Features BG": "",
  },
];

const projects = [
  {
    slug: "form",
    order: 1,
    title: "Form",
    cover: covers[0],
    featured: true,
    typeEn: "Commercial interior",
    typeBg: "Търговски интериор",
    date: "2024-01-01",
    summaryEn:
      "A boutique and atelier where flowing lines, natural stone and the existing architecture come together in a cohesive spatial composition.",
    summaryBg:
      "Бутик и ателие, в които плавни линии, естествен камък и съществуващата архитектура се съчетават в цялостна пространствена композиция.",
    descriptionEn:
      "A boutique and atelier where flowing lines, natural stone and the existing architecture come together in a cohesive spatial composition and lead the eye from one room to another.",
    descriptionBg:
      "Бутик и ателие, в които плавни линии, естествен камък и съществуващата архитектура се съчетават в цялостна пространствена композиция и водят погледа от едно помещение към друго.",
  },
  {
    slug: "balance",
    order: 2,
    title: "Balance",
    cover: covers[1],
    featured: true,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2023-06-01",
    summaryEn:
      "A contemporary interior where clean forms, natural materials and a light palette interpret the Japandi aesthetic.",
    summaryBg:
      "Съвременен интериор, в който чисти форми, естествени материали и светла палитра интерпретират Japandi естетиката.",
    descriptionEn:
      "A contemporary interior where clean forms, natural materials and a light palette interpret the Japandi aesthetic.",
    descriptionBg:
      "Съвременен интериор, в който чисти форми, естествени материали и светла палитра интерпретират Japandi естетиката.",
  },
  {
    slug: "rhythm",
    order: 3,
    title: "Rhythm",
    cover: covers[2],
    featured: false,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2023-01-01",
    summaryEn:
      "A contemporary home where vertical lines, geometric accents and natural textures create a consistent visual rhythm.",
    summaryBg:
      "Съвременен дом, в който вертикални линии, геометрични акценти и естествени текстури създават последователен визуален ритъм.",
    descriptionEn:
      "A contemporary home where vertical lines, geometric accents and natural textures create a consistent visual rhythm throughout the space. The requirement is for elegant yet brilliant design, achieved with flowing shapes, natural stone and wood, LED lighting, glass and gold elements.",
    descriptionBg:
      "Съвременен дом с последователен визуален ритъм. Изискването е за елегантен, но блестящ дизайн — с плавни форми, естествен камък и дърво, LED осветление, стъкло и златни елементи.",
  },
  {
    slug: "variations",
    order: 4,
    title: "Variations",
    cover: covers[3],
    featured: false,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2022-09-01",
    summaryEn:
      "A city interior developed through different stylistic approaches and design options.",
    summaryBg:
      "Градски интериор, разработен чрез различни стилови подходи и дизайн варианти.",
    descriptionEn:
      "A city interior developed through different stylistic approaches and design options, exploring the right balance between function, character and individuality.",
    descriptionBg:
      "Градски интериор, разработен чрез различни стилови подходи, в търсене на баланса между функция, характер и индивидуалност.",
  },
  {
    slug: "scale",
    order: 5,
    title: "Scale",
    cover: covers[4],
    featured: false,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2022-03-01",
    summaryEn:
      "Compact spaces where the bedroom and bathroom are precisely organized within a limited footprint.",
    summaryBg:
      "Компактни пространства, в които спалнята и банята са прецизно организирани в ограничен метраж.",
    descriptionEn:
      "Compact spaces where the bedroom and bathroom are precisely organized within a limited footprint, without compromising function or comfort. The assignment involves working with extremely small rooms for rent that must be practical, comfortable and cozy.",
    descriptionBg:
      "Компактни пространства за отдаване под наем, които трябва да бъдат практични, удобни и уютни, без компромис с функцията и комфорта.",
  },
  {
    slug: "heritage",
    order: 6,
    title: "Heritage",
    cover: covers[5],
    featured: false,
    typeEn: "Residential renovation",
    typeBg: "Жилищна реновация",
    date: "2021-11-01",
    summaryEn:
      "The renovation of an old house, combining existing architecture with new solutions.",
    summaryBg:
      "Реновация на стара къща, съчетаваща съществуващата архитектура с нови решения.",
    descriptionEn:
      "The renovation of an old house, combining the character of its existing architecture with new solutions for the staircase, bedrooms and bathrooms.",
    descriptionBg:
      "Реновация на стара къща, съчетаваща характера на съществуващата архитектура с нови решения за стълбището, спалните и баните.",
  },
  {
    slug: "unity",
    order: 7,
    title: "Unity",
    cover: covers[6],
    featured: false,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2021-05-01",
    summaryEn:
      "A family interior brought together through a consistent material and colour concept.",
    summaryBg:
      "Семеен интериор, обединен чрез последователна материална и цветова концепция.",
    descriptionEn:
      "A family interior where the living area, kitchen, bedrooms and service spaces are brought together through a consistent material and colour concept.",
    descriptionBg:
      "Семеен интериор, в който дневната зона, кухнята, спалните и сервизните помещения са обединени чрез последователна материална и цветова концепция.",
  },
  {
    slug: "potential",
    order: 8,
    title: "Potential",
    cover: covers[7],
    featured: false,
    typeEn: "Residential interior",
    typeBg: "Жилищен интериор",
    date: "2020-10-01",
    summaryEn:
      "A small apartment designed to make the most of its space and budget.",
    summaryBg:
      "Малък апартамент, проектиран да извлече максимума от пространството и бюджета.",
    descriptionEn:
      "A small apartment designed to make the most of its space and budget, without creating a sense of limited living space.",
    descriptionBg:
      "Малък апартамент, проектиран да извлече максимума от пространството и бюджета, без усещане за ограничено жилищно пространство.",
  },
];

async function main() {
  console.log(`Airtable base: ${baseId}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(APPLY ? "Mode: APPLY" : "Mode: DRY RUN (no changes will be made)");

  const existingSettings = await listAll(TABLES.siteSettings);
  const existingServices = await listAll(TABLES.services);
  const existingPrices = await listAll(TABLES.prices);
  const existingPosts = await listAll(TABLES.blogPosts);
  const existingProjects = await listAll(TABLES.projects);
  const existingImages = await listAll(TABLES.projectImages);

  await seedOne(
    TABLES.siteSettings,
    siteSettings,
    existingSettings,
    (r) => r.fields["Internal Name"] === "Production",
    "Site Settings / Production",
  );

  for (const service of services) {
    await seedOne(
      TABLES.services,
      service,
      existingServices,
      (r) => r.fields.Slug === service.Slug,
      `Service ${service.Slug}`,
    );
  }

  for (const price of prices) {
    await seedOne(
      TABLES.prices,
      price,
      existingPrices,
      (r) => r.fields["Internal Name"] === price["Internal Name"],
      `Price ${price["Internal Name"]}`,
    );
  }

  for (const post of blogPosts) {
    await seedOne(
      TABLES.blogPosts,
      post,
      existingPosts,
      (r) => r.fields.Slug === post.Slug,
      `Blog ${post.Slug}`,
    );
  }

  const projectIdBySlug = new Map(
    existingProjects
      .filter((r) => r.fields.Slug)
      .map((r) => [r.fields.Slug, r.id]),
  );

  for (const project of projects) {
    const fields = {
      "Internal Name": project.title,
      Slug: project.slug,
      Status: "Published",
      Order: project.order,
      "Title EN": project.title,
      "Title BG": project.title,
      "Summary EN": project.summaryEn,
      "Summary BG": project.summaryBg,
      "Description EN": project.descriptionEn,
      "Description BG": project.descriptionBg,
      "Project Type EN": project.typeEn,
      "Project Type BG": project.typeBg,
      "Location EN": "Bulgaria",
      "Location BG": "България",
      "Project Date": project.date,
      "Cover Image": attachment(wixUrl(project.cover)),
      Featured: project.featured,
      "Featured Order": project.featured ? project.order : undefined,
    };

    const created = await seedOne(
      TABLES.projects,
      fields,
      existingProjects,
      (r) => r.fields.Slug === project.slug,
      `Project ${project.slug}`,
    );
    if (created?.id) projectIdBySlug.set(project.slug, created.id);
    if (!projectIdBySlug.has(project.slug)) {
      const existing = existingProjects.find((r) => r.fields.Slug === project.slug);
      if (existing) projectIdBySlug.set(project.slug, existing.id);
    }
  }

  for (const project of projects) {
    const projectId = projectIdBySlug.get(project.slug);
    if (!projectId) {
      console.log(`Skip images for ${project.slug}: project record missing`);
      continue;
    }

    const imageSpecs = [
      {
        name: `${project.title} — full`,
        media: project.cover,
        order: 1,
        span: "full",
        altEn: `${project.title} interior view`,
        altBg: `${project.title} интериорен изглед`,
      },
      {
        name: `${project.title} — detail`,
        media: project.cover,
        order: 2,
        span: "half",
        altEn: `${project.title} detail`,
        altBg: `${project.title} детайл`,
      },
      {
        name: `${project.title} — atmosphere`,
        media: ATMOSPHERE,
        order: 3,
        span: "half",
        altEn: `${project.title} atmosphere`,
        altBg: `${project.title} атмосфера`,
      },
    ];

    for (const image of imageSpecs) {
      await seedOne(
        TABLES.projectImages,
        {
          "Internal Name": image.name,
          Project: [projectId],
          Image: attachment(wixUrl(image.media, 1200, 1600)),
          Order: image.order,
          "Alt Text EN": image.altEn,
          "Alt Text BG": image.altBg,
          "Layout Span": image.span,
        },
        existingImages,
        (r) =>
          r.fields["Internal Name"] === image.name &&
          (r.fields.Project || []).includes(projectId),
        `Image ${image.name}`,
      );
    }
  }

  console.log(
    APPLY
      ? "\nSeed complete. Review attachments in Airtable (Wix URLs may take a moment to import)."
      : "\nDry run complete. Rerun with --apply to create records.",
  );
}

async function seedOne(table, fields, existing, matcher, label) {
  const found = existing.find(matcher);
  if (found) {
    console.log(`Skip (exists): ${label}`);
    return found;
  }
  console.log(`${APPLY ? "Create" : "Plan"}: ${label}`);
  if (!APPLY) return null;
  const created = await createRecords(table, [fields]);
  const record = created[0];
  existing.push(record);
  return record;
}

async function listAll(table) {
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const payload = await api(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?${params}`,
    );
    records.push(...payload.records);
    offset = payload.offset;
  } while (offset);
  return records;
}

async function createRecords(table, fieldsList) {
  const payload = await api(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      body: JSON.stringify({
        records: fieldsList.map((fields) => ({
          fields: Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined),
          ),
        })),
        typecast: true,
      }),
    },
  );
  return payload.records;
}

async function api(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.error?.type || payload?.raw || response.statusText;
    fail(`Airtable API ${response.status}: ${message}`);
  }
  return payload;
}

function fail(message) {
  console.error(`\nERROR: ${message}`);
  process.exit(1);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
