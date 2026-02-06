export const mockNotifications = [
  // 🧑‍🎓 Student Notifications
  {
    id: 1,
    role: "student",
    title: "Class Booking Confirmed",
    message: "Your Math tutoring session is confirmed for tomorrow at 3 PM.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    role: "student",
    title: "Schedule Update",
    message: "Your English class has been moved to 4 PM.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    role: "student",
    title: "Payment Successful",
    message: "Payment for Physics course completed.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    role: "student",
    title: "Assignment Reminder",
    message: "Your Science assignment is due tomorrow. Don’t forget to submit!",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 5,
    role: "student",
    title: "New Message from Teacher",
    message: "Mr. Sharma has sent feedback on your last project.",
    time: "1 day ago",
    unread: false,
  },

  // 👩‍👧 Parent Notifications
  {
    id: 6,
    role: "parent",
    title: "Child Attendance Alert",
    message: "Your child Riya was marked absent today.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 7,
    role: "parent",
    title: "Fee Payment Reminder",
    message: "Your child’s term fee is due by October 20.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 8,
    role: "parent",
    title: "Exam Schedule Released",
    message: "Final exam schedule for Grade 9 is now available.",
    time: "6 hours ago",
    unread: false,
  },
  {
    id: 9,
    role: "parent",
    title: "Report Card Available",
    message: "Your child’s mid-term report card can now be viewed online.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 10,
    role: "parent",
    title: "PTM Invitation",
    message:
      "You are invited to attend the Parent-Teacher Meeting on October 15.",
    time: "2 days ago",
    unread: true,
  },

  // 👨‍🏫 Teacher Notifications
  {
    id: 11,
    role: "teacher",
    title: "New Assignment Submission",
    message: "Student Rahul submitted the Math project for review.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 12,
    role: "teacher",
    title: "Class Rescheduled",
    message: "Your Science class has been shifted to 11 AM tomorrow.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 13,
    role: "teacher",
    title: "Meeting Reminder",
    message: "Staff meeting scheduled today at 3 PM in Room 201.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 14,
    role: "teacher",
    title: "New Student Enrolled",
    message: "A new student has joined your English course.",
    time: "8 hours ago",
    unread: true,
  },
  {
    id: 15,
    role: "teacher",
    title: "Performance Report Submitted",
    message: "You successfully submitted your class performance report.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 16,
    role: "school",
    title: "System Maintenance Notice",
    message: "The school portal will be under maintenance from 10 PM to 12 AM.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 17,
    role: "school",
    title: "New Teacher Joined",
    message: "Mr. Raj Mehta has joined as a Physics teacher for Class 10.",
    time: "6 hours ago",
    unread: true,
  },
  {
    id: 18,
    role: "school",
    title: "Monthly Report Uploaded",
    message: "The monthly attendance and performance reports are available.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 19,
    role: "school",
    title: "Event Scheduled",
    message: "The Annual Sports Day will be held on November 10.",
    time: "3 days ago",
    unread: false,
  },
  {
    id: 20,
    role: "school",
    title: "Teacher Evaluation Pending",
    message: "Reminder: Please complete teacher evaluations by October 20.",
    time: "4 days ago",
    unread: true,
  },
];

const getNotificationByRole = (role) => {
  return mockNotifications.filter((notification) => notification.role === role);
};

export { getNotificationByRole };
