import { languageOptions } from "../../../utils/utils";

const cardData = [
  {
    title: "Total Teachers",
    count: 7,
    icon: "Users",
    bgColor: "bg-brand-blue",
  },
  {
    title: "Active",
    count: 3,
    icon: "CircleCheckBig",
    bgColor: "bg-success",
  },
  {
    title: "Pending",
    count: 1,
    icon: "Clock4",
    bgColor: "bg-accent",
  },
  {
    title: "Languages",
    count: 12,
    icon: "Languages",
    bgColor: "bg-[#059669]",
  },
];

// Mock teachers data
const mockTeachers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["en", "es"],
    location: "New York, NY",
    experience: 5,
    isOnline: true,
    travelDistance: 15,
    hourlyRate: 45,
    availability: {
      onsite: true,
      online: true,
    },
    bio: `Experienced language teacher with over 5 years of teaching English and Spanish to students of all ages. Passionate about creating engaging learning experiences that help students achieve their language goals.`,
    stats: {
      totalLessons: 342,
      totalStudents: 89,
      rating: 4.9,
      totalEarnings: 15420,
    },
    joinedDate: "2022-03-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "pending",
    languages: [],
    location: "",
    experience: 3,
    isOnline: false,
    travelDistance: 20,
    hourlyRate: 40,
    availability: {
      onsite: true,
      online: false,
    },
    bio: `Native Chinese speaker with 3 years of experience teaching Mandarin to English speakers. Specializes in business Chinese and conversational skills.`,
    stats: {
      totalLessons: 0,
      totalStudents: 0,
      rating: 0,
      totalEarnings: 0,
    },
    joinedDate: "2024-08-10",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Miami, FL 33101",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["es", "fr"],
    location: "Miami, FL",
    experience: 7,
    isOnline: true,
    travelDistance: 25,
    hourlyRate: 50,
    availability: {
      onsite: true,
      online: true,
    },
    bio: `Bilingual educator with extensive experience in Spanish and French instruction. Holds a Master's degree in Applied Linguistics and specializes in immersive teaching methods.`,
    stats: {
      totalLessons: 567,
      totalStudents: 134,
      rating: 4.8,
      totalEarnings: 28350,
    },
    joinedDate: "2021-09-20",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Seattle, WA 98101",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "inactive",
    languages: ["ko", "en"],
    location: "Seattle, WA",
    experience: 4,
    isOnline: false,
    travelDistance: 10,
    hourlyRate: 42,
    availability: {
      onsite: true,
      online: false,
    },
    bio: `Korean language instructor with 4 years of experience. Focuses on practical conversation skills and cultural context to help students communicate effectively.`,
    stats: {
      totalLessons: 198,
      totalStudents: 45,
      rating: 4.7,
      totalEarnings: 8316,
    },
    joinedDate: "2022-11-08",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, Boston, MA 02101",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    status: "pending",
    languages: ["fr", "de"],
    location: "Boston, MA",
    experience: 2,
    isOnline: true,
    travelDistance: 12,
    hourlyRate: 38,
    availability: {
      onsite: false,
      online: true,
    },
    bio: `Recent graduate with a degree in Modern Languages. Passionate about French and German instruction with a focus on interactive online learning methods.`,
    stats: {
      totalLessons: 0,
      totalStudents: 0,
      rating: 0,
      totalEarnings: 0,
    },
    joinedDate: "2024-08-08",
  },
  {
    id: 6,
    name: "Carlos Martinez",
    email: "carlos.martinez@email.com",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Ln, Phoenix, AZ 85001",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["es", "pt"],
    location: "Phoenix, AZ",
    experience: 6,
    isOnline: true,
    travelDistance: 18,
    hourlyRate: 47,
    availability: {
      onsite: true,
      online: true,
    },
    bio: `Native Spanish speaker with expertise in both Spanish and Portuguese. 6 years of experience helping students achieve fluency through immersive conversation practice.`,
    stats: {
      totalLessons: 423,
      totalStudents: 97,
      rating: 4.9,
      totalEarnings: 19881,
    },
    joinedDate: "2021-12-03",
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const availabilityOptions = [
  { value: "all", label: "All Types" },
  { value: "onsite", label: "Onsite Only" },
  { value: "online", label: "Online Only" },
  { value: "both", label: "Both" },
];

const experienceOptions = [
  { value: "all", label: "All Experience" },
  { value: "0-2", label: "0-2 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years" },
];

const languagesOptions = [
  { value: "", label: "All Languages" },
  ...languageOptions,
];

const teachersPerPage = 5;

export {
  cardData,
  mockTeachers,
  statusOptions,
  availabilityOptions,
  experienceOptions,
  languagesOptions,
  teachersPerPage,
};
