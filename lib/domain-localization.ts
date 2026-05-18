import type { Locale } from "@/lib/i18n";

const arMap: Record<string, string> = {
  "Primary Air Compressor": "ضاغط الهواء الرئيسي",
  "Conveyor Motor 12": "محرك الناقل 12",
  "Cooling Water Pump 7": "مضخة مياه التبريد 7",
  "Exhaust Fan 4": "مروحة العادم 4",
  Compression: "الهواء المضغوط",
  "Material Handling": "مناولة المواد",
  Pumping: "الضخ",
  Ventilation: "التهوية",
  "Utilities Plant": "محطة الخدمات",
  "Casting Plant": "مصنع السباكة",
  "Maintain current preventive plan and continue trend monitoring.": "الحفاظ على خطة الصيانة الوقائية الحالية مع الاستمرار في مراقبة الاتجاهات التشغيلية.",
  "Progressive bearing wear or misalignment is likely contributing to the failure pattern.": "من المرجح أن يكون تآكل المحامل التدريجي أو عدم المحاذاة من العوامل المساهمة في نمط العطل الحالي.",
  "Repeated recent incident frequency suggests the current maintenance interval is too wide.": "يشير تكرار الحوادث الأخيرة إلى أن الفاصل الزمني الحالي للصيانة أوسع من اللازم.",
  "Recent corrective history indicates the issue may be recurring rather than isolated.": "يبين سجل المعالجات الأخيرة أن المشكلة قد تكون متكررة وليست حالة منفردة.",
  "Review compressor heat increase and lubrication cycle": "مراجعة ارتفاع حرارة الضاغط ودورة التزييت",
  "Compressor thermal drift": "انحراف حراري في الضاغط",
  "Compressor heat trend may increase operator exposure during manual inspection": "قد يرفع اتجاه حرارة الضاغط مستوى تعرض المشغل أثناء الفحص اليدوي",
  "Synthetic compressor lubricant": "زيت ضاغط صناعي",
  "Maintenance planning and execution capture": "تسجيل تخطيط الصيانة وتنفيذها",
  "Logged predictive inspection scope, parts reservation, and closure evidence requirements.": "تم تسجيل نطاق الفحص التنبئي، وحجز القطع، ومتطلبات أدلة الإغلاق.",
  "Pressure instability, vibration growth, and active safety escalation": "عدم استقرار الضغط، وارتفاع الاهتزاز، مع تصعيد نشط لمخاطر السلامة.",
  "Thermal drift, due maintenance window, and rising power draw": "انحراف حراري واقتراب نافذة الصيانة وارتفاع استهلاك الطاقة.",
  "Trend review scheduled with reliability engineer.": "تمت جدولة مراجعة الاتجاهات مع مهندس الاعتمادية.",
  "Ahmed Al-Qahtani": "أحمد القحطاني",
  "Maha Al-Dosari": "مها الدوسري",
  "Khaled Al-Qahtani": "خالد القحطاني",
};

export function localizeDomainText(value: string, locale: Locale) {
  if (locale !== "ar") {
    return value;
  }

  return arMap[value] ?? value;
}

export function localizeDomainList(values: string[], locale: Locale) {
  return values.map((value) => localizeDomainText(value, locale));
}
