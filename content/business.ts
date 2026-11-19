import { DAYS, type OpeningHours } from '../lib/hours.ts';

/** Street address and canonical mapping query for the restaurant. */
export interface BusinessAddress {
  /** Street number and name. */
  street: string;
  /** City or locality. */
  locality: string;
  /** State or region code. */
  region: string;
  /** Postal or ZIP code. */
  postalCode: string;
  /** Two-letter ISO 3166-1 alpha-2 country code (e.g. "US"). */
  country: string;
  /** Cross-street note and sample-landmark disclaimer shown in Find us. */
  note: string;
  /** Single canonical query used by Google Maps search, directions and embed helpers. */
  mapQuery: string;
}

/** Arrival note shown in the Find us spread. */
export interface DirectionNote {
  /** Short heading for the arrival note. */
  heading: string;
  /** Plain-text description without unverified parking or access promises. */
  text: string;
}

/** Practical service feature with qualified description. */
export interface Amenity {
  /** Unique URL-safe identifier. */
  id: string;
  /** Short feature label. */
  label: string;
  /** Qualified plain-text explanation. */
  description: string;
}

/** Private dining and group-enquiry copy. */
export interface PrivateDiningInfo {
  /** Section or inset heading. */
  heading: string;
  /** Plain-text overview of group dinners. */
  description: string;
  /** Qualified group-size note (availability and layout confirmed by reply). */
  capacityNote: string;
  /** Suggested details for guests to include in a group enquiry message. */
  usefulToInclude: string[];
}

/** Frequently asked question rendered as a native disclosure item. */
export interface FaqItem {
  /** Unique URL-safe identifier. */
  id: string;
  /** Visitor question shown in <summary>. */
  question: string;
  /** Plain-text answer shown when expanded. */
  answer: string;
}

/** Optional external social profile link. */
export interface SocialLink {
  /** Platform or link label. */
  label: string;
  /** Full https:// URL. */
  url: string;
}

/** Complete steakhouse business profile. */
export interface Business {
  /** Public display name; also update site.config.json's name when renaming. */
  name: string;
  /** Short headline for the home page. */
  tagline: string;
  /** Plain-text introduction used by the page and fallback metadata. */
  introduction: string;
  /** Public contact address, never a private notification destination. */
  email: string;
  /** Public telephone number; blank hides it. */
  phone: string;
  /** Two-paragraph editorial note on the kitchen and room. */
  story: {
    /** Section heading for the story spread. */
    heading: string;
    /** Plain-text paragraphs (no invented awards, heritage dates or named farms). */
    paragraphs: string[];
  };
  /** Physical address and mapping query. */
  address: BusinessAddress;
  /** Arrival and cross-street notes for visitors. */
  directions: DirectionNote[];
  /** Weekly sample service schedule (Monday–Sunday) in local time. */
  openingHours: OpeningHours[];
  /** Optional manual service announcement (never automatically labelled as today's news). */
  notice?: string;
  /** Practical service highlights with honest qualifications. */
  amenities: Amenity[];
  /** Group and private-dining enquiry details. */
  privateDining: PrivateDiningInfo;
  /** Six visitor FAQs covering enquiries, walk-ins, weights, cross-contact, groups and demo data. */
  faqs: FaqItem[];
  /** Public social links; empty by default so no fake accounts ship. */
  socialLinks: SocialLink[];
  /** Contact page copy; the hosted form supports name, email and message only. */
  enquiries: {
    /** Contact page heading. */
    title: string;
    /** No booking, payment or delivery promises. */
    introduction: string;
    /** Suggestions for the message, not additional form inputs. */
    usefulToInclude: string[];
  };
}

export const business: Business = {
  name: 'Cinder & Vesper',
  tagline: 'Cuts. Coals. A slower evening.',
  introduction:
    'An evening chophouse built around white-oak coals, clearly listed cuts by weight, and unhurried conversation across the table.',
  email: 'hello@example.com',
  phone: '(212) 555-0148',
  story: {
    heading: 'A slower evening around the grate',
    paragraphs: [
      'Cinder & Vesper is arranged like a working cut sheet rather than a velvet dining room. Every cut on the ledger lists its approximate pre-cooking weight, marbling profile and portion price up front, so the table can decide between an eight-ounce fillet or a thirty-two-ounce porterhouse for two without theatre.',
      'We light the hearth in the afternoon and cook over banked coals until the last seating winds down. Whether you come for a single steak and a glass of red, coal-roasted cauliflower from the hearth, or a long-table dinner in the back room, the pace is yours.',
    ],
  },
  address: {
    street: '20 Times Square',
    locality: 'New York',
    region: 'NY',
    postalCode: '10036',
    country: 'US',
    note: 'Northeast corner of 7th Avenue and 47th Street — a public landmark placeholder used for this template demo, not a real restaurant address.',
    mapQuery: '20 Times Square, New York, NY 10036',
  },
  directions: [
    {
      heading: 'Cross streets & transit',
      text: 'Set at the northeast corner of 7th Avenue and West 47th Street in Midtown, within a short walk of the 47–50 Sts–Rockefeller Ctr, 49th Street and Times Sq–42nd Street subway stations.',
    },
    {
      heading: 'Arrival & seating requests',
      text: 'Street conditions and step-free approach routes vary by entrance. Include any mobility or seating requirements in your enquiry so the team can confirm the room layout before you arrive.',
    },
  ],
  openingHours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '17:00', closes: '22:00' },
    { day: 'Wednesday', opens: '17:00', closes: '22:00' },
    { day: 'Thursday', opens: '17:00', closes: '22:00' },
    { day: 'Friday', opens: '17:00', closes: '23:00' },
    { day: 'Saturday', opens: '17:00', closes: '23:00' },
    { day: 'Sunday', opens: '16:00', closes: '21:00' },
  ],
  notice:
    'Sample service note: large shared bone-in cuts rest for twenty minutes before carving; please allow extra time on later seatings.',
  amenities: [
    {
      id: 'table-service',
      label: 'Evening table service',
      description: 'Full dinner service paced around the hearth, with shared sides and cellar pairings by the glass or bottle.',
    },
    {
      id: 'vegetarian-main',
      label: 'Dedicated vegetable main',
      description: 'Coal-roasted cauliflower and seasonal vegetable plates cooked to order; prepared in a shared kitchen.',
    },
    {
      id: 'private-dining-enquiries',
      label: 'Private dining enquiries',
      description: 'Groups of 8 to 16 may enquire about our back ledger table; availability and layout are confirmed by reply.',
    },
  ],
  privateDining: {
    heading: 'Private dining & group tables',
    description:
      'Groups of 8 to 16 guests may enquire about seated dinners at our back ledger table, with shared bone-in cuts carved for the table alongside vegetable mains and cellar pairings.',
    capacityNote:
      'Groups of 8–16 may enquire; table layout, date availability and set-menu arrangements are confirmed only by reply.',
    usefulToInclude: [
      'Preferred evening, arrival window and any alternative dates',
      'Approximate guest count (8 to 16 guests for group seating)',
      'Preference for shared bone-in cuts or individual course plating',
      'Dietary requirements, alcohol-free pairings or access questions',
    ],
  },
  faqs: [
    {
      id: 'how-to-enquire',
      question: 'How do I enquire about a table?',
      answer:
        'Send a message through our Contact page, email hello@example.com or call (212) 555-0148 with your preferred evening, time and party size. Sending an enquiry does not reserve a table automatically; all arrangements are confirmed only when we reply.',
    },
    {
      id: 'walk-ins',
      question: 'Do you welcome walk-in guests?',
      answer:
        'Walk-in guests are welcome whenever the dining room or counter has space. Because evening pacing depends on the night’s tables, walk-in availability is confirmed by the team in person and is never guaranteed in advance.',
    },
    {
      id: 'shared-cuts-and-portions',
      question: 'How are cut weights listed, and can cuts be shared?',
      answer:
        'Weights in the cut ledger are approximate pre-cooking weights in ounces, and every price is for the listed portion—never per ounce. Smaller cuts are sized for one, while the 32oz bone-in porterhouse is cut to share between two.',
    },
    {
      id: 'dietary-needs',
      question: 'How do you handle dietary requirements and cross-contact?',
      answer:
        'Menu items prepared with gluten-free or dairy-free ingredients, as well as vegetarian and vegan dishes, are noted in the ledger. However, all dishes are prepared in a shared kitchen and over open coals where cross-contact can occur. Please mention any allergies or dietary needs when enquiring and again when ordering.',
    },
    {
      id: 'private-groups',
      question: 'Can we enquire for a private group or celebration dinner?',
      answer:
        'Yes. Groups of 8 to 16 guests may enquire about our back ledger table via the Contact page. Share your preferred dates, approximate guest count and any dietary notes, and our team will reply to confirm whether we can host your group.',
    },
    {
      id: 'sample-location-and-hours',
      question: 'Are this address and schedule for a real restaurant?',
      answer:
        'No. Cinder & Vesper, its menu and its weekly hours are fictitious sample content for this website template, and 20 Times Square is used solely as a public landmark placeholder for map links.',
    },
  ],
  socialLinks: [],
  enquiries: {
    title: 'Reservation & private dining enquiries',
    introduction:
      'Tell us about the evening you have in mind. Sending a message does not reserve a table or arrange payment; your plans are confirmed only when we reply.',
    usefulToInclude: [
      'Preferred date and time, plus an alternative evening if your plans are flexible',
      'Party size',
      'Whether you are asking about a regular table or a private-dining enquiry (8–16 guests)',
      'Dietary requirements, access needs or other questions for the kitchen and dining room',
    ],
  },
};

export { DAYS };

/** Single-line street and city address for display. */
export function formatAddress(address: BusinessAddress = business.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** Format an OpeningHours record for human display (e.g. "17:00 – 22:00 (5pm – 10pm)" or "Closed"). */
export function formatServiceHours(entry: OpeningHours): string {
  if (!entry.opens || !entry.closes) return 'Closed';
  return `${entry.opens} – ${entry.closes}`;
}
