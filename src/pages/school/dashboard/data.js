import ManageCourseIcon from "../../../components/icons/ManageCourseIcon";

export const TAG_CONFIG = {
  group: { text: "Group", icon: "Users", color: "bg-blue-100 text-blue-800" },
  "1-on-1": {
    text: "1-on-1",
    icon: "User",
    color: "bg-blue-100 text-blue-800",
  },
  online: {
    text: "Online Course",
    image: "/assets/images/video-camera.svg",
    color: "bg-green-100 text-green-800",
  },
  "in-person": {
    text: "In-Person",
    icon: "MapPin",
    color: "bg-green-100 text-green-800",
  },
  CurriculumGames: {
    text: "Curriculum-Aligned Games",
    icon: "Gamepad2",
    color: "bg-orange-100 text-orange-800",
  },
  TrailAvailable: {
    text: "Trial Lessons",
    icon: "Gift",
    color: "bg-[#DDF2FF] text-[#009DFF]",
  },
};

const currencySymbol = (c) => {
  const cur = String(c || "USD").toUpperCase();
  if (cur === "USD") return "$";
  if (cur === "INR") return "₹";
  if (cur === "EUR") return "€";
  if (cur === "GBP") return "£";
  return `${cur} `;
};

export const buildSchoolCardData = (metrics = {}) => {
  const activeTeachers = Number(metrics.activeTeachers ?? 0);
  const scheduledLessonsThisWeek = Number(
    metrics.scheduledLessonsThisWeek ?? 0,
  );
  const totalCourses = Number(metrics.totalCourses ?? 0);

  const revenueObj = metrics.monthlyRevenue || {};

  // currency (support both)
  const revenueCurrency = revenueObj.currency || "USD";

  // Prefer NET if available (payout net), else fallback to gross, else fallback legacy "amount"
  const netCents =
    revenueObj.netAmountCents != null
      ? Number(revenueObj.netAmountCents)
      : null;
  const grossCents =
    revenueObj.amountCents != null ? Number(revenueObj.amountCents) : null;

  // Legacy support (already dollars)
  const legacyAmount =
    revenueObj.netAmount != null
      ? Number(revenueObj.netAmount)
      : revenueObj.amount != null
        ? Number(revenueObj.amount)
        : null;

  // Decide final amount in dollars
  const amountDollars = Number.isFinite(netCents)
    ? netCents / 100
    : Number.isFinite(grossCents)
      ? grossCents / 100
      : Number.isFinite(legacyAmount)
        ? legacyAmount
        : 0;

  const revenueText = `${currencySymbol(revenueCurrency)}${amountDollars.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  )}`;

  return [
    {
      title: "Active Teachers",
      count: activeTeachers,
      icon: "Users",
      bgColor: "bg-brand-blue",
    },
    {
      title: "Scheduled Lessons This Week",
      count: scheduledLessonsThisWeek,
      icon: "Calendar",
      bgColor: "bg-[#059669]",
      isNavigate: true,
      navigateTo: "/school/scheduled-lessons",
    },
    {
      title: "Total course",
      count: totalCourses,
      iconComponent: ManageCourseIcon,
      bgColor: "bg-accent",
    },
    {
      title: "Monthly Revenue",
      count: revenueText,
      icon: "DollarSign",
      bgColor: "bg-success",
    },
  ];
};
