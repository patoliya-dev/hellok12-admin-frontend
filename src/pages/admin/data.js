import { getAllCountries } from "../../utils/utils";

const tabs = [
  { id: "personal", name: "Personal Info", icon: "User" },
  { id: "bio", name: "Bio & Specializations", icon: "FileText" },
  { id: "certifications", name: "Certifications", icon: "Award" },
  { id: "availability", name: "Availability", icon: "Calendar" },
  { id: "preferences", name: "Teaching Preferences", icon: "Settings" },
  { id: "highlights", name: "Teaching Highlights", icon: "Image" },
];

const daysOfWeek = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

const timeSlots = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese (Mandarin)" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
  { value: "hindi", label: "Hindi" },
];

const ageGroupOptions = [
  { value: "3-5", label: "3-5" },
  { value: "6-8", label: "6-8" },
  { value: "9-12", label: "9-12" },
  { value: "13-15", label: "13-15" },
  { value: "16-18", label: "16-18" },
];

const timezoneOptions = [
  {
    value: "Pacific/Midway",
    label: "(UTC-12:00) International Date Line West",
  },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  {
    value: "America/Los_Angeles",
    label: "(UTC-08:00) Pacific Time (US & Canada)",
  },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  {
    value: "America/New_York",
    label: "(UTC-05:00) Eastern Time (US & Canada)",
  },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time (Canada)" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "(UTC-03:00) Buenos Aires",
  },
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
  { value: "Europe/London", label: "(UTC+00:00) London, Dublin, Edinburgh" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Amsterdam, Berlin, Rome" },
  { value: "Europe/Istanbul", label: "(UTC+02:00) Athens, Istanbul, Cairo" },
  { value: "Asia/Riyadh", label: "(UTC+03:00) Moscow, Kuwait, Riyadh" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Muscat" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Islamabad, Karachi" },
  {
    value: "Asia/Kolkata",
    label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  {
    value: "Asia/Shanghai",
    label: "(UTC+08:00) Beijing, Hong Kong, Singapore",
  },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Osaka, Sapporo, Tokyo" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland, Wellington" },
];

// Mock data for demonstration
const mockMediaItems = [
  {
    id: 1,
    name: "Spanish Conversation Class - Beginner Level",
    type: "video",
    url: "https://images.pexels.com/photos/8471919/pexels-photo-8471919.jpeg",
    size: 15728640, // 15MB
    uploadDate: new Date("2024-08-10T14:30:00"),
    format: "mp4",
    isIntro: true,
  },
  {
    id: 2,
    name: "Grammar Lesson Whiteboard",
    type: "image",
    url: "https://images.pixabay.com/photo/2017/05/13/12/40/fashion-2309519_1280.jpg",
    size: 2097152, // 2MB
    uploadDate: new Date("2024-08-09T10:15:00"),
    format: "jpg",
    isIntro: false,
  },
  {
    id: 3,
    name: "Student Presentation - French Culture",
    type: "video",
    url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643",
    size: 25165824, // 24MB
    uploadDate: new Date("2024-08-08T16:45:00"),
    format: "mov",
    isIntro: false,
  },
  {
    id: 4,
    name: "Vocabulary Cards Activity",
    type: "image",
    url: "https://images.pexels.com/photos/8471918/pexels-photo-8471918.jpeg",
    size: 1572864, // 1.5MB
    uploadDate: new Date("2024-08-07T11:20:00"),
    format: "png",
    isIntro: false,
  },
  {
    id: 5,
    name: "Interactive Language Game Session",
    type: "video",
    url: "https://images.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg",
    size: 18874368, // 18MB
    uploadDate: new Date("2024-08-06T13:10:00"),
    format: "mp4",
    isIntro: false,
  },
  {
    id: 6,
    name: "Classroom Setup for Group Work",
    type: "image",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    size: 3145728, // 3MB
    uploadDate: new Date("2024-08-05T09:30:00"),
    format: "jpg",
    isIntro: false,
  },
];

const validationRules = {
  personal: [
    "fullName",
    "email",
    "phone",
    "country",
    "state",
    "city",
    "yearsOfExperience",
  ],
  bio: [
    "aboutYou",
    "teachingStyle",
    "whyTeaching",
    "teachingLanguages",
    "nativeLanguage",
    "ageGroupTeach",
  ],
  certifications: ["highestEducation"],
  availability: [],
  preferences: [],
  highlights: [], // no required fields
};

const countryOptions = getAllCountries();

export {
  tabs,
  daysOfWeek,
  timeSlots,
  languageOptions,
  ageGroupOptions,
  timezoneOptions,
  mockMediaItems,
  validationRules,
  countryOptions,
};
