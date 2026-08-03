import { temporaryWixAsset } from "@/data/mocks/media";
import type { Project, ProjectImage } from "@/types/content";

function galleryFromCover(
  coverId: string,
  mediaId: string,
  title: string,
): ProjectImage[] {
  const cover = temporaryWixAsset(
    `${coverId}-1`,
    mediaId,
    `${title} interior view`,
    `${title} интериорен изглед`,
  );
  return [
    { ...cover, order: 1, layoutSpan: "full" },
    {
      ...temporaryWixAsset(
        `${coverId}-2`,
        mediaId,
        `${title} detail`,
        `${title} детайл`,
        1000,
        1200,
      ),
      order: 2,
      layoutSpan: "half",
    },
    {
      ...temporaryWixAsset(
        `${coverId}-3`,
        "8a77d8_b315c66d6bd94ce78f53b2158aef8b16~mv2.png",
        `${title} atmosphere`,
        `${title} атмосфера`,
        1000,
        1200,
      ),
      order: 3,
      layoutSpan: "half",
    },
  ];
}

const covers = [
  "8a77d8_8e03881a880541beaaf621b2654edf31~mv2.png",
  "8a77d8_1962249a003c483d88ecd88f30677bf3~mv2.png",
  "8a77d8_01657f5e88f74fddaa71b2e0bad02633~mv2.png",
  "8a77d8_f429eac970024fbcbfc6d8b945bdd96b~mv2.png",
  "8a77d8_a3b682e098754633a755c1266b80d583~mv2.png",
  "8a77d8_d698b76ef779423492a3d4739cefceb7~mv2.png",
  "8a77d8_c8734f6fbd184432bd2221d37a18aae1~mv2.jpg",
  "8a77d8_2f2a39c934264d229e39ec9a6ec6d970~mv2.png",
] as const;

export const mockProjects: Project[] = [
  {
    id: "proj-form",
    slug: "form",
    status: "published",
    order: 1,
    title: { en: "Form", bg: "Form" },
    summary: {
      en: "A boutique and atelier where flowing lines, natural stone and the existing architecture come together in a cohesive spatial composition.",
      bg: "Бутик и ателие, в които плавни линии, естествен камък и съществуващата архитектура се съчетават в цялостна пространствена композиция.",
    },
    description: {
      en: "A boutique and atelier where flowing lines, natural stone and the existing architecture come together in a cohesive spatial composition and lead the eye from one room to another.",
      bg: "Бутик и ателие, в които плавни линии, естествен камък и съществуващата архитектура се съчетават в цялостна пространствена композиция и водят погледа от едно помещение към друго.",
    },
    projectType: { en: "Commercial interior", bg: "Търговски интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2024-01-01",
    coverImage: temporaryWixAsset("form-cover", covers[0], "Form project", "Проект Form"),
    images: galleryFromCover("form", covers[0], "Form"),
    featured: true,
  },
  {
    id: "proj-balance",
    slug: "balance",
    status: "published",
    order: 2,
    title: { en: "Balance", bg: "Balance" },
    summary: {
      en: "A contemporary interior where clean forms, natural materials and a light palette interpret the Japandi aesthetic.",
      bg: "Съвременен интериор, в който чисти форми, естествени материали и светла палитра интерпретират Japandi естетиката.",
    },
    description: {
      en: "A contemporary interior where clean forms, natural materials and a light palette interpret the Japandi aesthetic.",
      bg: "Съвременен интериор, в който чисти форми, естествени материали и светла палитра интерпретират Japandi естетиката.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2023-06-01",
    coverImage: temporaryWixAsset(
      "balance-cover",
      covers[1],
      "Balance project",
      "Проект Balance",
    ),
    images: galleryFromCover("balance", covers[1], "Balance"),
    featured: true,
  },
  {
    id: "proj-rhythm",
    slug: "rhythm",
    status: "published",
    order: 3,
    title: { en: "Rhythm", bg: "Rhythm" },
    summary: {
      en: "A contemporary home where vertical lines, geometric accents and natural textures create a consistent visual rhythm.",
      bg: "Съвременен дом, в който вертикални линии, геометрични акценти и естествени текстури създават последователен визуален ритъм.",
    },
    description: {
      en: "A contemporary home where vertical lines, geometric accents and natural textures create a consistent visual rhythm throughout the space. The requirement is for elegant yet brilliant design, achieved with flowing shapes, natural stone and wood, LED lighting, glass and gold elements.",
      bg: "Съвременен дом с последователен визуален ритъм. Изискването е за елегантен, но блестящ дизайн — с плавни форми, естествен камък и дърво, LED осветление, стъкло и златни елементи.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2023-01-01",
    coverImage: temporaryWixAsset(
      "rhythm-cover",
      covers[2],
      "Rhythm project",
      "Проект Rhythm",
    ),
    images: galleryFromCover("rhythm", covers[2], "Rhythm"),
  },
  {
    id: "proj-variations",
    slug: "variations",
    status: "published",
    order: 4,
    title: { en: "Variations", bg: "Variations" },
    summary: {
      en: "A city interior developed through different stylistic approaches and design options.",
      bg: "Градски интериор, разработен чрез различни стилови подходи и дизайн варианти.",
    },
    description: {
      en: "A city interior developed through different stylistic approaches and design options, exploring the right balance between function, character and individuality.",
      bg: "Градски интериор, разработен чрез различни стилови подходи, в търсене на баланса между функция, характер и индивидуалност.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2022-09-01",
    coverImage: temporaryWixAsset(
      "variations-cover",
      covers[3],
      "Variations project",
      "Проект Variations",
    ),
    images: galleryFromCover("variations", covers[3], "Variations"),
  },
  {
    id: "proj-scale",
    slug: "scale",
    status: "published",
    order: 5,
    title: { en: "Scale", bg: "Scale" },
    summary: {
      en: "Compact spaces where the bedroom and bathroom are precisely organized within a limited footprint.",
      bg: "Компактни пространства, в които спалнята и банята са прецизно организирани в ограничен метраж.",
    },
    description: {
      en: "Compact spaces where the bedroom and bathroom are precisely organized within a limited footprint, without compromising function or comfort. The assignment involves working with extremely small rooms for rent that must be practical, comfortable and cozy.",
      bg: "Компактни пространства за отдаване под наем, които трябва да бъдат практични, удобни и уютни, без компромис с функцията и комфорта.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2022-03-01",
    coverImage: temporaryWixAsset("scale-cover", covers[4], "Scale project", "Проект Scale"),
    images: galleryFromCover("scale", covers[4], "Scale"),
  },
  {
    id: "proj-heritage",
    slug: "heritage",
    status: "published",
    order: 6,
    title: { en: "Heritage", bg: "Heritage" },
    summary: {
      en: "The renovation of an old house, combining existing architecture with new solutions.",
      bg: "Реновация на стара къща, съчетаваща съществуващата архитектура с нови решения.",
    },
    description: {
      en: "The renovation of an old house, combining the character of its existing architecture with new solutions for the staircase, bedrooms and bathrooms.",
      bg: "Реновация на стара къща, съчетаваща характера на съществуващата архитектура с нови решения за стълбището, спалните и баните.",
    },
    projectType: { en: "Residential renovation", bg: "Жилищна реновация" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2021-11-01",
    coverImage: temporaryWixAsset(
      "heritage-cover",
      covers[5],
      "Heritage project",
      "Проект Heritage",
    ),
    images: galleryFromCover("heritage", covers[5], "Heritage"),
  },
  {
    id: "proj-unity",
    slug: "unity",
    status: "published",
    order: 7,
    title: { en: "Unity", bg: "Unity" },
    summary: {
      en: "A family interior brought together through a consistent material and colour concept.",
      bg: "Семеен интериор, обединен чрез последователна материална и цветова концепция.",
    },
    description: {
      en: "A family interior where the living area, kitchen, bedrooms and service spaces are brought together through a consistent material and colour concept.",
      bg: "Семеен интериор, в който дневната зона, кухнята, спалните и сервизните помещения са обединени чрез последователна материална и цветова концепция.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2021-05-01",
    coverImage: temporaryWixAsset("unity-cover", covers[6], "Unity project", "Проект Unity"),
    images: galleryFromCover("unity", covers[6], "Unity"),
  },
  {
    id: "proj-potential",
    slug: "potential",
    status: "published",
    order: 8,
    title: { en: "Potential", bg: "Potential" },
    summary: {
      en: "A small apartment designed to make the most of its space and budget.",
      bg: "Малък апартамент, проектиран да извлече максимума от пространството и бюджета.",
    },
    description: {
      en: "A small apartment designed to make the most of its space and budget, without creating a sense of limited living space.",
      bg: "Малък апартамент, проектиран да извлече максимума от пространството и бюджета, без усещане за ограничено жилищно пространство.",
    },
    projectType: { en: "Residential interior", bg: "Жилищен интериор" },
    location: { en: "Bulgaria", bg: "България" },
    projectDate: "2020-10-01",
    coverImage: temporaryWixAsset(
      "potential-cover",
      covers[7],
      "Potential project",
      "Проект Potential",
    ),
    images: galleryFromCover("potential", covers[7], "Potential"),
  },
];
