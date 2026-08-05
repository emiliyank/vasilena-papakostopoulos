import type { Locale } from "@/lib/i18n/config";

type Dictionary = {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    contact: string;
    blog: string;
    prices: string;
    survey: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  hero: {
    cta: string;
  };
  about: {
    learnMore: string;
  };
  services: {
    heading: string;
  };
  portfolio: {
    heading: string;
    intro: string;
    viewProject: string;
  };
  contact: {
    heading: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    submit: string;
    submitting: string;
    privacyNote: string;
    success: string;
    error: string;
    validationError: string;
    rateLimited: string;
  };
  footer: {
    backToTop: string;
    rights: string;
  };
  project: {
    backToPortfolio: string;
    previous: string;
    next: string;
    location: string;
    type: string;
    date: string;
    openImage: string;
    closeLightbox: string;
    previousImage: string;
    nextImage: string;
    imageOf: string;
  };
  blog: {
    heading: string;
    readMore: string;
    backToBlog: string;
  };
  prices: {
    heading: string;
  };
  notFound: {
    title: string;
    body: string;
    home: string;
  };
  language: {
    label: string;
    en: string;
    bg: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      siteTitle: "Vassilena Papakostopoulos | Interior Design & 3D Visualisation",
      siteDescription:
        "Interior design, consultation and 3D visualisation focused on calm, functional and balanced spaces.",
    },
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contacts",
      blog: "Blog",
      prices: "Prices",
      survey: "Consultation survey",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      skipToContent: "Skip to content",
    },
    hero: {
      cta: "Discover more",
    },
    about: {
      learnMore: "Learn more",
    },
    services: {
      heading: "Services",
    },
    portfolio: {
      heading: "Portfolio",
      intro: "A small part of the projects completed over the years.",
      viewProject: "View project",
    },
    contact: {
      heading: "Get in touch",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      message: "Write a message",
      submit: "Submit",
      submitting: "Sending…",
      privacyNote:
        "By submitting this form you agree to be contacted about your inquiry.",
      success: "Thank you. Your message has been sent.",
      error: "Something went wrong. Please try again later.",
      validationError: "Please check the highlighted fields and try again.",
      rateLimited: "Too many requests. Please wait a moment and try again.",
    },
    footer: {
      backToTop: "Back to top",
      rights: "All rights reserved.",
    },
    project: {
      backToPortfolio: "Back to portfolio",
      previous: "Previous project",
      next: "Next project",
      location: "Location",
      type: "Type",
      date: "Date",
      openImage: "Open image",
      closeLightbox: "Close",
      previousImage: "Previous image",
      nextImage: "Next image",
      imageOf: "of",
    },
    blog: {
      heading: "Blog",
      readMore: "Read more",
      backToBlog: "Back to blog",
    },
    prices: {
      heading: "Prices",
    },
    notFound: {
      title: "Page not found",
      body: "The page you are looking for is unavailable.",
      home: "Return home",
    },
    language: {
      label: "Language",
      en: "EN",
      bg: "BG",
    },
  },
  bg: {
    meta: {
      siteTitle: "Василена Папакостопулос | Интериорен дизайн и 3D визуализация",
      siteDescription:
        "Интериорен дизайн, консултации и 3D визуализация с фокус върху спокойни, функционални и балансирани пространства.",
    },
    nav: {
      home: "Начало",
      about: "За мен",
      services: "Услуги",
      portfolio: "Портфолио",
      contact: "Контакти",
      blog: "Блог",
      prices: "Цени",
      survey: "Анкета за консултация",
      openMenu: "Отвори меню",
      closeMenu: "Затвори меню",
      skipToContent: "Към съдържанието",
    },
    hero: {
      cta: "Научете повече",
    },
    about: {
      learnMore: "Научете повече",
    },
    services: {
      heading: "Услуги",
    },
    portfolio: {
      heading: "Портфолио",
      intro: "Малка част от проектите, реализирани през годините.",
      viewProject: "Вижте проекта",
    },
    contact: {
      heading: "Свържете се",
      firstName: "Име",
      lastName: "Фамилия",
      email: "Имейл",
      message: "Напишете съобщение",
      submit: "Изпрати",
      submitting: "Изпращане…",
      privacyNote:
        "С изпращането на формуляра се съгласявате да бъдете свързани относно вашето запитване.",
      success: "Благодарим ви. Съобщението е изпратено.",
      error: "Възникна грешка. Моля, опитайте отново по-късно.",
      validationError: "Моля, проверете маркираните полета и опитайте отново.",
      rateLimited: "Твърде много опити. Моля, изчакайте малко и опитайте отново.",
    },
    footer: {
      backToTop: "Към началото",
      rights: "Всички права запазени.",
    },
    project: {
      backToPortfolio: "Към портфолиото",
      previous: "Предишен проект",
      next: "Следващ проект",
      location: "Локация",
      type: "Тип",
      date: "Дата",
      openImage: "Отвори изображение",
      closeLightbox: "Затвори",
      previousImage: "Предишно изображение",
      nextImage: "Следващо изображение",
      imageOf: "от",
    },
    blog: {
      heading: "Блог",
      readMore: "Прочетете повече",
      backToBlog: "Към блога",
    },
    prices: {
      heading: "Цени",
    },
    notFound: {
      title: "Страницата не е намерена",
      body: "Страницата, която търсите, не е налична.",
      home: "Към началото",
    },
    language: {
      label: "Език",
      en: "EN",
      bg: "BG",
    },
  },
};

export type AppDictionary = Dictionary;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
