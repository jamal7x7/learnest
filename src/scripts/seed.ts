import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  account as accountTable,
  announcementComments,
  announcementRecipients,
  announcementUserStatus,
  announcements,
  session as sessionTable,
  teamInviteCodes,
  teamMembers,
  teams,
  user as userTable,
} from "~/lib/server/schema/index";
import { AnnouncementPriority, AnnouncementStatus } from "~/lib/server/types"; // Import AnnouncementStatus
import { db } from "~/lib/server/db";

async function seed() {
  // Clean DB: truncate all tables in dependency order
  await db.execute(
    sql`TRUNCATE TABLE announcement_comments, announcement_recipients, announcement_user_status, team_invite_codes, announcements, team_members, teams, account, "user", session CASCADE`,
  );

  const arabicNames = [
    "Mohamed Alaoui",
    "Said Benani",
    "Fatima Zahra",
    "Khadija Idrissi",
    "Youssef Amine",
    "Hicham Bouzid",
    "Salma Chafai",
    "Abdellah Naciri",
    "Meryem El Aaroui",
    "Yassine Barada",
    "Amina Benjelloun",
    "Hassan Tazi",
    "Leila Saadi",
    "Hamza Belmekki",
    "Zineb El Aaroui",
    "Omar El Fassi",
    "Nadia Bennis",
    "Karim El Mansouri",
    "Samira El Ghazali",
    "Rachid El Idrissi",
    "Imane El Khatib",
    "Younes El Amrani",
    "Sara El Yacoubi",
    "Mounir El Hachimi",
    "Latifa El Fadili",
    "Nabil El Malki",
    "Rania El Gharbi",
    "Tarik El Moutawakkil",
    "Soukaina El Fassi",
    "Jalil El Amrani",
    "Mouad El Idrissi",
    "Hajar Boukhris",
    "Ayoub El Mahdi",
    "Ilham Bennis",
    "Zakaria El Khatib",
    "Najib El Ghazali",
    "Malak Benjelloun",
    "Yassir Tazi",
    "Siham El Aaroui",
    "Othmane Belmekki",
    "Rim El Fassi",
    "Houda Saadi",
    "Reda Barada",
    "Asmae Chafai",
    "Walid Bouzid",
    "Souad Belmekki",
    "Fouad El Mansouri",
    "Samia Idrissi",
    "Khalid Naciri",
    "Laila Benani",
    "Ayman Amine",
    "Ikram El Ghazali",
    "Yassine El Malki",
    "Kenza Saadi",
    "Soukaina El Aaroui",
    "Badr El Amrani",
    "Sanae El Fadili",
    "Meryem El Mahdi",
    "Noureddine Alaoui",
    "Imane Benjelloun",
    "Omar Bouzid",
    "Nadia El Fassi",
    "Hicham El Ghazali",
    "Salma El Aaroui",
    "Karim Barada",
    "Amina El Khatib",
    "Tarik Boukhris",
    "Latifa El Mansouri",
    "Hamza El Malki",
    "Rania El Fadili",
    "Abdelhak El Ghazali",
    "Mounir Benjelloun",
    "Loubna El Amrani",
    "Youssef El Fassi",
    "Samira El Aaroui",
    "Nabil El Khatib",
    "Imane Bouzid",
    "Younes Belmekki",
    "Sara Benani",
    "Mohamed El Ghazali",
    "Khadija El Aaroui",
    "Hassan El Fadili",
    "Leila El Mahdi",
    "Hamza Benjelloun",
    "Zineb El Ghazali",
    "Omar El Mansouri",
    "Nadia Benani",
    "Karim El Fadili",
    "Samira El Mahdi",
    "Rachid El Amrani",
    "Imane El Ghazali",
    "Younes Benjelloun",
    "Sara El Mahdi",
    "Mounir El Khatib",
    "Latifa El Aaroui",
    "Nabil El Amrani",
    "Rania El Mansouri",
    "Tarik El Ghazali",
    "Soukaina El Mahdi",
    "Jalil El Fadili",
    "Amina El Ouazzani",
    "Hassan El Moudden",
    "Fatima El Moutawakkil",
    "Khadija El Moudden",
    "Youssef El Yacoubi",
    "Hicham El Moudden",
    "Salma El Hachimi",
    "Abdellah El Mahdi",
    "Meryem El Moudden",
    "Yassine El Yacoubi",
    "Amina El Aaroui",
    "Hassan El Ghazali",
    "Fatima El Fassi",
    "Khadija El Hachimi",
    "Youssef El Amrani",
    "Hicham El Fassi",
    "Salma El Aaroui",
    "Abdellah El Ghazali",
    "Meryem El Fassi",
    "Yassine El Hachimi",
    "Amina El Idrissi",
    "Hassan El Mansouri",
    "Fatima El Mahdi",
    "Khadija El Idrissi",
    "Youssef El Ghazali",
    "Hicham El Mansouri",
    "Salma El Idrissi",
    "Abdellah El Mahdi",
    "Meryem El Idrissi",
    "Yassine El Mansouri",
    "Amina El Khatib",
    "Hassan El Yacoubi",
    "Fatima El Amrani",
    "Khadija El Khatib",
    "Youssef El Khatib",
    "Hicham El Yacoubi",
    "Salma El Khatib",
    "Abdellah El Amrani",
    "Meryem El Yacoubi",
    "Yassine El Khatib",
    "Amina El Fadili",
    "Hassan El Fassi",
    "Fatima El Hachimi",
    "Khadija El Fadili",
    "Youssef El Fassi",
    "Hicham El Hachimi",
    "Salma El Fadili",
    "Abdellah El Fassi",
    "Meryem El Fadili",
    "Yassine El Hachimi",
    "Amina El Moudden",
    "Hassan El Moudden",
    "Fatima El Moudden",
    "Khadija El Moudden",
    "Youssef El Moudden",
    "Hicham El Moudden",
    "Salma El Moudden",
    "Abdellah El Moudden",
    "Meryem El Moudden",
    "Yassine El Moudden",
    "Amina El Moutawakkil",
    "Hassan El Moutawakkil",
    "Fatima El Moutawakkil",
    "Khadija El Moutawakkil",
    "Youssef El Moutawakkil",
    "Hicham El Moutawakkil",
    "Salma El Moutawakkil",
    "Abdellah El Moutawakkil",
    "Meryem El Moutawakkil",
    "Yassine El Moutawakkil",
    "Amina El Ouazzani",
    "Hassan El Ouazzani",
    "Fatima El Ouazzani",
    "Khadija El Ouazzani",
    "Youssef El Ouazzani",
    "Hicham El Ouazzani",
    "Salma El Ouazzani",
    "Abdellah El Ouazzani",
    "Meryem El Ouazzani",
    "Yassine El Ouazzani",
  ];

  const names = [...new Set(arabicNames)].sort(() => 0.5 - Math.random());

  // 1. Users
  const studentCount = 100;
  const teacherCount = 20;
  const adminCount = 1;
  const students = Array.from({ length: studentCount }).map((_, i) => ({
    id: nanoid(),
    name: names[i],
    email: `student${i + 1}@example.com`,
    emailVerified: true,
    role: "student",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const teachers = Array.from({ length: teacherCount }).map((_, i) => ({
    id: nanoid(),
    name: names[studentCount + i],
    email: `teacher${i + 1}@example.com`,
    emailVerified: true,
    role: "teacher",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const admins = [
    {
      id: nanoid(),
      name: names[studentCount + teacherCount],
      email: "admin1@example.com",
      emailVerified: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const userList = [...students, ...teachers, ...admins];
  await db.insert(userTable).values(userList);

  // 1b. Accounts (for email/password login)
  const passwordHash = await hashPassword("password123");
  const accountList = userList.map((user) => ({
    id: nanoid(),
    accountId: user.email,
    providerId: "credential",
    userId: user.id,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await db.insert(accountTable).values(accountList);

  // 1c. Sessions (create a session for each user)
  const sessionList = userList.map((user) => ({
    id: nanoid(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
    token: nanoid(32),
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    userId: user.id,
    impersonatedBy: null,
  }));
  await db.insert(sessionTable).values(sessionList);

  // 2. Teams
  const teamCount = 40;

  // Helper function to generate abbreviation from team name
  const generateAbbreviation = (name: string) => {
    // Handle specific cases for French names like "Première Année" or "Deuxième Année"
    const processedName = name
      .replace(/Première Année/gi, "1A")
      .replace(/Deuxième Année/gi, "2A")
      .replace(/Tronc Commun/gi, "TC");

    return processedName
      .split(/\s|-|É|È|Ê|À|Â|Ô|Û|Î|Ç|Œ|Æ/)
      .map((word) => {
        // Remove accents and take the first letter
        const firstLetter = word
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
          .charAt(0)
          .toUpperCase();
        return firstLetter;
      })
      .join("");
  };

  const moroccanClassNames = [
    "Tronc Commun Scientifique",
    "Tronc Commun Littéraire",
    "Tronc Commun Technologique",
    "Première Année Bac Sciences Mathématiques A",
    "Première Année Bac Sciences Mathématiques B",
    "Première Année Bac Sciences Expérimentales",
    "Première Année Bac Sciences et Technologies Électriques",
    "Première Année Bac Sciences et Technologies Mécaniques",
    "Première Année Bac Sciences Économiques et Gestion",
    "Première Année Bac Arts Appliqués",
    "Première Année Bac Lettres et Sciences Humaines",
    "Deuxième Année Bac Sciences Mathématiques A",
    "Deuxième Année Bac Sciences Mathématiques B",
    "Deuxième Année Bac Sciences Physiques",
    "Deuxième Année Bac Sciences de la Vie et de la Terre",
    "Deuxième Année Bac Sciences Agronomiques",
    "Deuxième Année Bac Sciences et Technologies Électriques",
    "Deuxième Année Bac Sciences et Technologies Mécaniques",
    "Deuxième Année Bac Sciences Économiques",
    "Deuxième Année Bac Techniques de Gestion Comptable",
    "Deuxième Année Bac Arts Appliqués",
    "Deuxième Année Bac Lettres",
    "Deuxième Année Bac Sciences Humaines",
  ];

  const teamTypes = [
    "classroom",
    "club",
    "study_group",
    "committee",
    "sports",
    "music",
    "science",
    "math",
    "art",
    "debate",
  ];
  const teamList = Array.from({ length: teamCount }).map((_, i) => {
    const name = moroccanClassNames[i % moroccanClassNames.length];
    return {
      id: nanoid(),
      name: name,
      abbreviation: generateAbbreviation(name),
      type: faker.helpers.arrayElement(teamTypes),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await db.insert(teams).values(teamList);

  // 3. Team Members (assign each student to multiple teams - at least 7)
  const teamMemberList = [
    ...students.flatMap((student) => {
      // Assign each student to 7-10 random teams
      const numTeams = 7 + Math.floor(Math.random() * 4);
      const selectedTeams = faker.helpers.arrayElements(teamList, numTeams);
      return selectedTeams.map((team) => ({
        id: nanoid(),
        userId: student.id,
        teamId: team.id,
        role: "student",
        joinedAt: new Date(),
      }));
    }),
    ...teachers.map((teacher) => ({
      id: nanoid(),
      userId: teacher.id,
      teamId: faker.helpers.arrayElement(teamList).id,
      role: "teacher",
      joinedAt: new Date(),
    })),
  ];
  await db.insert(teamMembers).values(teamMemberList);

  // 4. Multilingual Announcements
  const announcementSubjectsMultilingual = {
    en: [
      {
        subject: "Upcoming Final Exam",
        details: [
          "The final examination for Mathematics will be held next week",
          "Please prepare all necessary materials for the Biology practical exam",
          "English Literature exam will cover chapters 1-8",
        ],
      },
      {
        subject: "Class Schedule Change",
        details: [
          "Physics class will be moved to Room 204",
          "Chemistry lab sessions rescheduled to Wednesday",
          "New tutorial sessions added for Advanced Mathematics",
        ],
      },
      {
        subject: "Assignment Deadline",
        details: [
          "History essay submission deadline extended",
          "Group project presentations scheduled for next Monday",
          "Mathematics homework due tomorrow",
        ],
      },
      {
        subject: "Study Group Session",
        details: [
          "Extra revision session for Chemistry",
          "Peer tutoring available for Physics",
          "Mathematics problem-solving workshop",
        ],
      },
      {
        subject: "Academic Achievement",
        details: [
          "Congratulations to the Science Olympiad winners",
          "Outstanding performance in the National Math Contest",
          "School debate team reaches finals",
        ],
      },
    ],
    fr: [
      {
        subject: "Examen Final à Venir",
        details: [
          "L'examen final de mathématiques aura lieu la semaine prochaine",
          "Veuillez préparer tout le matériel nécessaire pour l'examen pratique de biologie",
          "L'examen de littérature française couvrira les chapitres 1-8",
        ],
      },
      {
        subject: "Changement d'Horaires",
        details: [
          "Le cours de physique sera déplacé en salle 204",
          "Les séances de laboratoire de chimie sont reportées à mercredi",
          "Nouvelles sessions de tutorat ajoutées pour les mathématiques avancées",
        ],
      },
      {
        subject: "Date Limite des Devoirs",
        details: [
          "Date limite de soumission de l'essai d'histoire prolongée",
          "Présentations des projets de groupe prévues lundi prochain",
          "Devoirs de mathématiques à rendre demain",
        ],
      },
      {
        subject: "Session de Groupe d'Étude",
        details: [
          "Session de révision supplémentaire pour la chimie",
          "Tutorat par les pairs disponible pour la physique",
          "Atelier de résolution de problèmes mathématiques",
        ],
      },
      {
        subject: "Réussite Académique",
        details: [
          "Félicitations aux gagnants de l'Olympiade des Sciences",
          "Performance exceptionnelle au Concours National de Mathématiques",
          "L'équipe de débat de l'école atteint la finale",
        ],
      },
    ],
    ar: [
      {
        subject: "الامتحان النهائي القادم",
        details: [
          "سيعقد الامتحان النهائي للرياضيات الأسبوع المقبل",
          "يرجى تحضير جميع المواد اللازمة لامتحان الأحياء العملي",
          "امتحان الأدب العربي سيغطي الفصول 1-8",
        ],
      },
      {
        subject: "تغيير جدول الحصص",
        details: [
          "سيتم نقل حصة الفيزياء إلى القاعة 204",
          "تمت إعادة جدولة جلسات مختبر الكيمياء إلى يوم الأربعاء",
          "إضافة حصص تقوية جديدة للرياضيات المتقدمة",
        ],
      },
      {
        subject: "موعد تسليم الواجبات",
        details: [
          "تم تمديد موعد تسليم مقال التاريخ",
          "عروض المشاريع الجماعية مقررة يوم الاثنين القادم", // This line contains the typo
          "واجب الرياضيات مستحق غداً",
        ],
      },
      {
        subject: "جلسة مجموعة الدراسة",
        details: [
          "حصة مراجعة إضافية للكيمياء",
          "دروس خصوصية متاحة لمادة الفيزياء",
          "ورشة عمل لحل مسائل الرياضيات",
        ],
      },
      {
        subject: "الإنجاز الأكاديمي",
        details: [
          "تهانينا للفائزين في أولمبياد العلوم",
          "أداء متميز في مسابقة الرياضيات الوطنية",
          "فريق المناظرات المدرسي يصل إلى النهائيات",
        ],
      },
    ],
  };

  const generateAnnouncement = () => {
    const language = faker.helpers.arrayElement(["en", "fr", "ar"]);
    const subjectObj = faker.helpers.arrayElement(
      announcementSubjectsMultilingual[language],
    );
    const details = faker.helpers.arrayElement(subjectObj.details);
    const team = faker.helpers.arrayElement(teamList);
    const announcement = {
      id: nanoid(),
      senderId: faker.helpers.arrayElement([...teachers, ...admins]).id,
      content: `${subjectObj.subject}: ${details}`,
      allowComments: Boolean(Math.random() < 0.5),
      createdAt: faker.date.recent({ days: 30 }),
      updatedAt: new Date(), 
      priority: faker.helpers.arrayElement(Object.values(AnnouncementPriority)),
      type: "plain",
      scheduledDate: null as Date | null, // Initialize correctly
      status: AnnouncementStatus.PUBLISHED,
    };
    // Optionally, make some announcements scheduled
    if (Math.random() < 0.1) { // 10% chance to be scheduled
      const futureDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000) + (Math.random() * 7 * 24 * 60 * 60 * 1000)); // 7-14 days in future
      announcement.scheduledDate = futureDate;
      announcement.status = AnnouncementStatus.SCHEDULED;
      // Ensure updatedAt is appropriate; can be same as createdAt or slightly before scheduledDate for realism
      announcement.updatedAt = new Date(announcement.createdAt.getTime() + Math.random() * 1000 * 60); 
    }
    return {
      announcement,
      team,
    };
  };

  // Generate announcements with their recipients and user status
  const announcementData = Array.from({ length: 300 }).map(() => {
    const { announcement, team } = generateAnnouncement();
    // Set allowComments to true for 70% of announcements
    announcement.allowComments = faker.datatype.boolean({ probability: 0.7 });
    return { announcement, team };
  });

  // Insert announcements
  await db
    .insert(announcements)
    .values(announcementData.map(({ announcement }) => announcement));

  // Insert announcement recipients (link announcements to teams)
  await db.insert(announcementRecipients).values(
    announcementData.map(({ announcement, team }) => ({
      id: nanoid(),
      announcementId: announcement.id,
      teamId: team.id,
    })),
  );

  // Insert announcement user status (for each student in the team)
  const announcementUserStatusList = announcementData.flatMap(
    ({ announcement, team }) => {
      // Get all students in the team
      const teamStudentMembers = teamMemberList.filter(
        (member) => member.teamId === team.id && member.role === "student",
      );

      // Create status entries for each student
      return teamStudentMembers.map((member) => ({
        id: nanoid(),
        userId: member.userId,
        announcementId: announcement.id,
        isAcknowledged: faker.datatype.boolean({ probability: 0.8 }), // 80% chance acknowledged
        isBookmarked: faker.datatype.boolean({ probability: 0.2 }), // 20% chance bookmarked
        acknowledgedAt: faker.datatype.boolean({ probability: 0.8 })
          ? faker.date.recent({ days: 5 })
          : null,
        bookmarkedAt: faker.datatype.boolean({ probability: 0.2 })
          ? faker.date.recent({ days: 5 })
          : null,
      }));
    },
  );

  if (announcementUserStatusList.length > 0) {
    await db.insert(announcementUserStatus).values(announcementUserStatusList);
  }

  // 5. Announcement Comments
  console.log("Generating announcement comments...");
  
  // Only create comments for announcements that allow comments
  const announcementsWithComments = announcementData.filter(
    ({ announcement }) => announcement.allowComments
  );
  
  // Generate comments for announcements
  const commentsList = [];
  const commentPromises = [];
  
  for (const { announcement, team } of announcementsWithComments) {
    // Get team members who can comment on this announcement
    const teamStudentMembers = teamMemberList.filter(
      (member) => member.teamId === team.id
    );
    
    if (teamStudentMembers.length === 0) continue;
    
    // Generate 0-5 comments per announcement
    const commentCount = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < commentCount; i++) {
      const commentId = nanoid();
      const commenter = faker.helpers.arrayElement(teamStudentMembers);
      const commentDate = new Date(announcement.createdAt.getTime() + (1000 * 60 * 60 * Math.random() * 48)); // 0-48 hours after announcement
      
      const comment = {
        id: commentId,
        announcementId: announcement.id,
        userId: commenter.userId,
        content: faker.helpers.arrayElement([
          "Thank you for the information!",
          "When will we get more details about this?",
          "I have a question about this announcement.",
          "This is very helpful, thanks for sharing.",
          "Could you please clarify this point?",
          "I'm looking forward to this.",
          "Is there anything specific we need to prepare?",
          "Will this be covered in the next class?",
          "I appreciate the heads up!",
          "This is important information for everyone.",
        ]),
        createdAt: commentDate,
        updatedAt: commentDate,
        parentId: null,
      };
      
      commentsList.push(comment);
      
      // Add 0-3 replies to this comment
      const replyCount = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < replyCount; j++) {
        const replyId = nanoid();
        const replier = faker.helpers.arrayElement(teamStudentMembers);
        const replyDate = new Date(commentDate.getTime() + (1000 * 60 * 30 * Math.random() * 24)); // 0-12 hours after comment
        
        const reply = {
          id: replyId,
          announcementId: announcement.id,
          userId: replier.userId,
          content: faker.helpers.arrayElement([
            "I agree with this comment.",
            "That's a good point!",
            "I was wondering the same thing.",
            "Let me add some additional context here...",
            "Thanks for bringing this up.",
            "I think we should discuss this further in class.",
            "The teacher mentioned this in the previous session.",
            "I found some additional resources on this topic.",
            "Does anyone else have more information about this?",
            "This is exactly what I was thinking!",
          ]),
          createdAt: replyDate,
          updatedAt: replyDate,
          parentId: commentId,
        };
        
        commentsList.push(reply);
      }
    }
  }
  
  // Insert all comments
  if (commentsList.length > 0) {
    await db.insert(announcementComments).values(commentsList);
    console.log(`✅ Added ${commentsList.length} comments and replies`);
  }
  
  // 6. Team Invite Codes (optional, keep small for demo)
  const inviteCodeList = Array.from({ length: 5 }).map(() => {
    const team = faker.helpers.arrayElement(teamList);
    return {
      code: nanoid(6).toUpperCase(),
      teamId: team.id,
      createdBy: faker.helpers.arrayElement(userList).id,
      expiresAt: faker.date.soon(),
      maxUses: 10,
      uses: 0,
      createdAt: new Date(),
    };
  });
  await db.insert(teamInviteCodes).values(inviteCodeList);

  console.log("✅ Database seeded successfully!");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
