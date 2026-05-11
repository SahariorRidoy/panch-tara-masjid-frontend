export interface BilingualText { en: string; bn: string }

export interface User {
  _id: string; name: string; email: string; role: "admin" | "committee";
}

export interface Pagination { total: number; page: number; limit: number; totalPages: number }

export interface ApiResponse<T> { success: boolean; message: string; data: T }

export interface PaginatedData<T> { data: T[]; pagination: Pagination }

export interface HeroSlide {
  _id: string; title: BilingualText; tagline: BilingualText;
  imageUrl: string; order: number; isActive: boolean;
}

export interface ContactInfo {
  _id: string;
  address: BilingualText;
  city?: BilingualText;
  phone?: string;
  phones: string[];
  email: string;
  logo?: string;
  logoUrl?: string;
  logoPublicId?: string;
  masjidName?: BilingualText;
  tagline?: BilingualText;
  about?: BilingualText;
  mapUrl?: string;
  socialLinks: { facebook?: string; youtube?: string; instagram?: string; whatsapp?: string };
}

export interface MarqueeData {
  text: BilingualText; isActive: boolean; bgColor: string; textColor: string;
}

export interface JumahSession {
  label: BilingualText; azanTime: string; khutbahTime: string;
  iqamahTime: string; isActive: boolean;
}

export interface JumahData { sessions: JumahSession[]; note: BilingualText }

export interface Event {
  _id: string; title: BilingualText; description: BilingualText;
  location?: BilingualText; date: string; imageUrl?: string;
  images?: string[]; imagePublicIds?: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Course {
  _id: string; title: BilingualText; description: BilingualText;
  category: BilingualText;
  teacher: { name: BilingualText; bio: BilingualText };
  schedule: { days: BilingualText; time: string; duration: BilingualText };
  image?: string; imageUrl?: string; status: "active" | "inactive";
}

export interface CommitteeMember {
  _id: string; name: BilingualText; designation: BilingualText;
  phone: string; imageUrl?: string; tenureStart: string; tenureEnd?: string;
}

export type DonationCategory =
  | 'friday_collection' | 'donation' | 'zakat' | 'sadaqah' | 'construction_fund' | 'rent' | 'other_income'
  | 'salary' | 'utility' | 'maintenance' | 'construction' | 'event' | 'cleaning' | 'stationery' | 'other_expense';

export type PaymentMethodType = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer';

export interface Donation {
  _id: string; type: "income" | "expense"; amount: number;
  category: DonationCategory; paymentMethod: PaymentMethodType;
  personName?: string; reference?: string; note?: string;
  date: string; createdBy?: { name: string }; createdAt: string;
}

export interface DonationSummary {
  allTime: { income: number; expense: number; balance: number };
  period:  { income: number; expense: number; balance: number };
  categoryBreakdown: { type: string; category: string; total: number }[];
}

export interface PaymentMethod {
  _id: string; type: "bank" | "mobile_banking" | "cash" | "other";
  provider: BilingualText; accountName?: string; accountNumber?: string;
  routingNumber?: string; instructions?: BilingualText; qr?: string;
  isActive: boolean; order: number;
}

export interface Notice {
  _id: string; title: BilingualText; body: BilingualText;
  type: "general" | "urgent" | "event" | "prayer";
  pinned: boolean; expiresAt?: string; createdAt: string;
}

export interface MediaItem {
  _id: string; title: string; category: string; url: string; createdAt: string;
}

export interface Document {
  _id: string; title: BilingualText; description?: BilingualText;
  category: string; fileUrl: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'ppt' | 'pptx' | 'txt' | 'zip';
  isPublic: boolean; createdAt: string;
}

export interface BlogPost {
  _id: string; title: BilingualText;
  description: BilingualText; author: BilingualText;
  category: BilingualText; date: string;
  imageUrl?: string; createdAt: string; isActive: boolean;
}

export interface SalahTimes {
  Fajr: string; Sunrise: string; Dhuhr: string;
  Asr: string; Maghrib: string; Isha: string;
}
