const announcementAuthors = [
  "Jane Doe", "John Smith", "Emily Johnson", "Michael Brown", "Sarah Lee",
  "David Wilson", "Olivia Martinez", "James Anderson", "Sophia Thomas", "Daniel Taylor",
  "Emma Moore", "Matthew Jackson", "Ava White", "Benjamin Harris", "Mia Martin",
  "Elijah Thompson", "Charlotte Garcia", "William Clark", "Amelia Rodriguez", "Henry Lewis"
];

const announcementContents = [
  "Welcome to the new platform! 🎉",
  "Maintenance scheduled for this weekend.",
  "Don't miss our upcoming webinar on productivity.",
  "New features have been added to your dashboard.",
  "We value your feedback—let us know your thoughts.",
  "Scheduled downtime on Saturday at 2 AM.",
  "Check out the latest updates in your profile.",
  "Security improvements have been implemented.",
  "Happy holidays from the entire team!",
  "Your account settings have been enhanced.",
  "Join our community forum for more support.",
  "Mobile app version 2.0 is now available.",
  "Weekly digest: Top news and updates.",
  "We're hiring! Check out open positions.",
  "Refer a friend and earn rewards.",
  "Survey: Help us improve your experience.",
  "Feature spotlight: Custom notifications.",
  "Thank you for being part of our journey.",
  "Bug fixes and performance improvements.",
  "Stay tuned for more exciting announcements!"
];

const commentAuthors = [
  "Lucas Nguyen", "Megan Patel", "Ethan Kim", "Grace Chen", "Jack Miller",
  "Lily Perez", "Alexander Rivera", "Zoe Cooper", "Samuel Murphy", "Ella Bailey",
  "Logan Cox", "Chloe Reed", "Jacob Stewart", "Harper Sanchez", "Mason Price",
  "Layla Howard", "Sebastian Ward", "Avery Brooks", "Carter Bell", "Scarlett Evans"
];

const commentContents = [
  "This is fantastic news, thanks for sharing!",
  "Looking forward to the new features.",
  "Appreciate the transparency on maintenance.",
  "Great job, team!",
  "How will this affect current users?",
  "Thanks for the update.",
  "Excited to try this out.",
  "Will there be more details soon?",
  "Love the improvements!",
  "Keep up the great work.",
  "Very helpful, thank you.",
  "Can you provide more info?",
  "Awesome, can't wait!",
  "This is a much-needed change.",
  "Thanks for listening to feedback.",
  "How do I access this feature?",
  "Will there be a recording of the webinar?",
  "Nice, thanks for letting us know.",
  "This makes things so much easier.",
  "Appreciate the quick response."
];

function generateComments(announcementId: string) {
  return Array.from({ length: 10 }, (_, i) => {
    const author = commentAuthors[i % commentAuthors.length];
    const content = commentContents[(i + Number(announcementId)) % commentContents.length];
    return {
      id: `${announcementId}-comment-${i + 1}`,
      author,
      content,
      date: `2025-05-${String(10 + ((i + 1) % 20)).padStart(2, '0')}`,
      // avatar: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(author)}`,
      avatar: ``,
    };
  });
}

export const ANNOUNCEMENTS = Array.from({ length: 20 }, (_, i) => {
  const id = `${i + 1}`;
  const author = announcementAuthors[i % announcementAuthors.length];
  const content = announcementContents[i % announcementContents.length];
  return {
    id,
    author,
    avatar: ``,
    content,
    date: `2025-05-${String(16 - i).padStart(2, '0')}`,
    comments: generateComments(id),
  };
});
