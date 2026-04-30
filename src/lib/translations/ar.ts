export default {
  seo: {
    "sahifa-sajjadia": {
      title: "الصحيفة السجادية",
      description: "الصحيفة السجادية الكاملة – كتاب الأدعية المروي عن الإمام علي بن الحسين.",
    },
    ziyarat: {
      title: "الزيارات – تحيات للأئمة",
      description: "استعرض الزيارات الأصيلة مع النص العربي والتحويل الصوتي والترجمات.",
    },
    home: {
      title: "اكتشف الأدعية الإسلامية الموثوقة",
      description: "استكشف مجموعة متزايدة من الأدعية الإسلامية الموثوقة بالنص العربي، وترجمة سطر بسطر إلى لغات متعددة، مع إمكانية الاستماع، والنقل الصوتي، ووضع القراءة المباشرة للقراءة الجماعية.",
    },
    "collection": {
      "title": "مجموعات الأدعية الإسلامية لمناسبات خاصة",
      "description": "اعثر على مجموعات тематية من الأدعية الإسلامية الأصيلة – لشهر رمضان، والليالي الخاصة، والأدعية اليومية والمزيد. مع النص العربي، والترجمة، والتشغيل الصوتي، ووضع القراءة المباشرة."
    },
    "blog": {
      "title": "المدونة",
      "description": "اكتشف مقالات حول الأدعية، والمعرفة الإسلامية، والرؤى التقنية، وأحدث الأخبار المتعلقة بالمنصة."
    }
  },
  settings: {
    system: {
      title: "إعدادات النظام",
      theme: { light: "فاتح", dark: "داكن" },
      fullscreen: "وضع ملء الشاشة",
    },
    dua: {
      language: {
        title: "{{index}}. لغة الدعاء",
        note: 'يُستخدم هذا الإعداد في وضع "القراءة" للدعاء.',
        "not-found": "لم يتم العثور على أي لغة.",
      },
      arabic: "عربي",
      transliteration: "التحويل الصوتي",
      "second-translation": {
        label: "لغة الترجمة الثانية",
        none: "لا شيء",
      },
    },
  },
  nav: {
    duas: "الأدعية",
    collections: "المجموعات",
    blog: "المدونة",
  },
  "dua-card": {
    "read-full": "اقرأ الدعاء كاملاً",
    "reading-time": "{{minutes}} دقيقة قراءة",
  },
  filter: {
    title: "تصفية",
    apply: "تطبيق",
  },
  duas: {
    "search-placeholder": "ابحث عن الأدعية...",
  },
  pagination: {
    "show-duas": "عرض الأدعية:",
    range: "{{first}} – {{last}} من {{total}} دعاء",
  },
  session: {
    "every-day": "كل {{day}}",
  },
  footer: {
    "social-media": "وسائل التواصل الاجتماعي",
    info: "معلومات",
    contact: "تواصل معنا",
    "privacy-policy": "سياسة الخصوصية",
  },
  profile: {
    "signed-in-as": "مسجل الدخول كـ",
    "planned-sessions": "جلسات القراءة المباشرة المخططة",
  },
  dua: {
    by: "<i>{{narrator}}</i> رُوي عن",
    views: {
      translation: "الترجمة",
      reading: "القراءة",
      presentation: "العرض التقديمي",
    },
  },
  "live-reading": {
    title: "القراءة المباشرة",
    placeholder: "رمز القراءة المباشرة",
    "how-to": { title: "كيف تعمل القراءة المباشرة؟" },
    live: "مباشر",
    code: {
      label: "الرمز:",
      template: "الرمز: <strong>{{code}}</strong>",
    },
    participants: "المشاركون: <strong>{{count}}</strong>",
    host: {
      status: "المضيف {{status}}",
      online: "متصل",
      offline: "غير متصل",
    },
    join: {
      title: "الانضمام إلى قراءة مباشرة قائمة",
      label: "أدخل رمز القراءة المباشرة:",
      validation: "يرجى إدخال رمز!",
      spelling: "لا يهم استخدام الأحرف الكبيرة أو الصغيرة.",
      button: "انضم",
    },
    start: {
      title: "ابدأ قراءة مباشرة الآن",
      description: "ابدأ قراءة مباشرة وادعُ أصدقاءك للقراءة معًا. أنت من يحدد الآية الحالية.",
      button: "ابدأ القراءة المباشرة",
    },
    "scan-to-join": "امسح للانضمام",
    plan: {
      title: "جدولة قراءة مباشرة",
      description: "خطط لجلسة قراءة مباشرة. سيتم إنشاء رابط يمكنك من خلاله بدء الجلسة كمضيف في أي وقت – طالما لم تبدأ بعد.",
      "email-label": "بريدك الإلكتروني:",
      "error-invalid": "يرجى إدخال بريد إلكتروني صالح!",
      button: "جدولة القراءة المباشرة",
    },
    active: {
      participation: {
        host: "أنت المضيف.",
        participant: "أنت تشارك في غرفة القراءة المباشرة {{code}}.",
      },
      hostStatus: "المضيف <strong>{{status}}</strong>.",
      inviteLinkLabel: "رابط الدعوة",
      copied: "تم النسخ",
      leave: "غادر القراءة المباشرة",
    },
    create: {
      "profile-hint": "هل تريد استضافة قراءة مباشرة؟ سجّل حسابك وأنشئ جلسة من ملفك الشخصي.",
    },
  },
  "session-card": {
    "start-session": "بدء الجلسة",
    "qr-code": "رمز QR",
    edit: "تعديل",
    delete: "حذف",
    "download-svg": "تحميل SVG",
    "delete-confirm": "هل تريد حذف هذه الجلسة نهائياً؟",
    confirm: "تأكيد",
    cancel: "إلغاء",
    name: "الاسم",
    schedule: "الجدول الزمني",
    recurring: "متكرر",
    once: "مرة واحدة",
    save: "حفظ",
  },
  audio: {
    speed: "سرعة التشغيل",
    "back-to-settings": "العودة إلى الإعدادات",
    reciter: "القارئ",
  },
  type: {
    dua: "Dua",
    ziyarat: "Ziyarat",
    munajat: "Munajat",
    amal: "Amal",
    salawat: "Salawat",
    salat: "Salaat",
    tasbihat: "Tasbihat",
  },
  narrator: {
    "prophet-muhammad": "النبي محمد",
    "imam-ali": "الإمام علي",
    "lady-fatimah": "السيدة فاطمة",
    "imam-hasan": "الإمام الحسن",
    "imam-hussain": "الإمام الحسين",
    "imam-sajjad": "الإمام علي زين العابدين",
    "imam-baqir": "الإمام محمد الباقر",
    "imam-sadiq": "الإمام جعفر الصادق",
    "imam-kadhim": "الإمام موسى الكاظم",
    "imam-ridha": "الإمام علي الرضا",
    "imam-jawad": "الإمام محمد الجواد",
    "imam-hadi": "الإمام علي الهادي",
    "imam-askari": "الإمام الحسن العسكري",
    "imam-mahdi": "الإمام محمد المهدي",
  },
  topic: {
    "islam-quests": "أسئلة إسلامية"
  },
};
