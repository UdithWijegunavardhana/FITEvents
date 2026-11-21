const fs = require('fs');
const path = require('path');

const TIME_ZONE_OFFSET = '+05:30';
const COLOMBO_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const FIRST_EVENT_DAY = 3;
const LAST_EVENT_DAY = 56;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const templates = [
  {
    title: 'Hands-on React Native: Build Your First Mobile App',
    category: 'workshop',
    venue: 'Computer Lab 3',
    organizer: 'IT Society',
    hour: 14,
    minutes: 180,
    capacity: 60,
    registeredCount: 42,
    tags: ['mobile', 'react-native'],
    description:
      'A three-hour workshop where you build and run a small React Native app on your own phone. Bring a laptop with Node.js and Android Studio installed.',
  },
  {
    title: 'Tech Talk: Scaling Payments Infrastructure in Sri Lanka',
    category: 'talk',
    venue: 'Auditorium',
    organizer: 'Faculty of IT',
    hour: 15,
    minute: 30,
    minutes: 90,
    capacity: 250,
    registeredCount: 188,
    tags: ['fintech', 'backend'],
    description:
      'An engineering lead from a local fintech walks through how their payment platform handles peak-season traffic, and what they look for when hiring graduates.',
  },
  {
    title: 'Git and GitHub for Team Projects',
    category: 'workshop',
    venue: 'Computer Lab 1',
    organizer: 'Open Source Club',
    hour: 13,
    minutes: 120,
    capacity: 50,
    tags: ['git', 'collaboration'],
    description:
      'Branching, pull requests and code review in practice. You will resolve a merge conflict together with a teammate.',
  },
  {
    title: 'Career Talk: From Intern to Software Engineer',
    category: 'talk',
    venue: 'Lecture Hall 2',
    organizer: 'Career Guidance Unit',
    hour: 16,
    minutes: 60,
    capacity: 180,
    tags: ['careers', 'internships'],
    description:
      'Three recent graduates share how they landed their first role, what the first year was like, and what they wish they had learned earlier.',
  },
  {
    title: 'FIT Hack 2026: 24-Hour Hackathon',
    category: 'hackathon',
    venue: 'Main Hall',
    organizer: 'IEEE Student Branch',
    hour: 9,
    minutes: 24 * 60,
    capacity: 120,
    registeredCount: 120,
    tags: ['hackathon', 'teams'],
    description:
      'Form a team of up to four and build something useful for the campus in 24 hours. Food, mentors and prizes provided.',
  },
  {
    title: 'UI Design Basics with Figma',
    category: 'workshop',
    venue: 'Innovation Lab',
    organizer: 'Design Circle',
    hour: 14,
    minutes: 150,
    capacity: 40,
    tags: ['design', 'figma'],
    description:
      'Learn layout, spacing and colour by redesigning a real campus app screen from scratch.',
  },
  {
    title: 'Freshers Welcome Mixer',
    category: 'social',
    venue: 'Faculty Courtyard',
    organizer: 'Student Union',
    hour: 17,
    minute: 30,
    minutes: 150,
    capacity: 200,
    tags: ['social', 'freshers'],
    description:
      'Meet students from every batch over snacks and games. A relaxed way to start the semester.',
  },
  {
    title: 'Cloud Computing in Practice',
    category: 'talk',
    venue: 'Auditorium',
    organizer: 'Faculty of IT',
    hour: 15,
    minutes: 90,
    capacity: 250,
    tags: ['cloud', 'devops'],
    description:
      'A cloud architect shows how a real product moves from a laptop to production, including costs and mistakes.',
  },
  {
    title: 'Career Fair: Internships for 3rd Years',
    category: 'career',
    venue: 'Lecture Hall 1',
    organizer: 'Career Guidance Unit',
    hour: 10,
    minutes: 360,
    capacity: 400,
    registeredCount: 263,
    tags: ['internships', 'careers'],
    description:
      'Meet recruiters from more than 20 software companies. Bring printed copies of your CV and be ready for short on-the-spot interviews.',
  },
  {
    title: 'Docker for Beginners',
    category: 'workshop',
    venue: 'Computer Lab 3',
    organizer: 'IT Society',
    hour: 14,
    minutes: 120,
    capacity: 45,
    tags: ['docker', 'devops'],
    description:
      'Containerise a small web app, run it anywhere and share it with a classmate.',
  },
  {
    title: 'CV and LinkedIn Clinic',
    category: 'career',
    venue: 'Seminar Room',
    organizer: 'Career Guidance Unit',
    hour: 13,
    minutes: 180,
    capacity: 60,
    tags: ['cv', 'linkedin'],
    description:
      'Bring your CV and get one-to-one feedback from industry volunteers. Walk-ins welcome until the slots run out.',
  },
  {
    title: 'Board Games and Pizza Night',
    category: 'social',
    venue: 'Student Lounge',
    organizer: 'Gaming Club',
    hour: 18,
    minutes: 180,
    capacity: 80,
    tags: ['games', 'social'],
    description:
      'Strategy games, card games and pizza. Beginners are welcome; we will teach you.',
  },
  {
    title: 'Machine Learning Study Jam',
    category: 'workshop',
    venue: 'Computer Lab 1',
    organizer: 'AI Society',
    hour: 14,
    minutes: 180,
    capacity: 50,
    tags: ['ai', 'python'],
    description:
      'Train your first classifier in a notebook, then compare approaches with other teams.',
  },
  {
    title: 'Tech Talk: Building Offline-First Mobile Apps',
    category: 'talk',
    venue: 'Lecture Hall 2',
    organizer: 'IT Society',
    hour: 16,
    minutes: 75,
    capacity: 180,
    tags: ['mobile', 'offline'],
    description:
      'Caching, sync queues and conflict handling, with demos from apps used by thousands of people.',
  },
  {
    title: 'Startup Pitch Night',
    category: 'career',
    venue: 'Auditorium',
    organizer: 'Entrepreneurship Cell',
    hour: 17,
    minutes: 150,
    capacity: 250,
    tags: ['startups', 'pitching'],
    description:
      'Student teams pitch their ideas to a panel of founders and investors. Audience votes for a favourite.',
  },
  {
    title: 'Game Jam: 48 Hours',
    category: 'hackathon',
    venue: 'Innovation Lab',
    organizer: 'Gaming Club',
    hour: 18,
    minutes: 48 * 60,
    capacity: 60,
    tags: ['games', 'hackathon'],
    description:
      'Build a small game around a secret theme revealed at kick-off. Solo or teams of three.',
  },
  {
    title: 'Cybersecurity Essentials Workshop',
    category: 'workshop',
    venue: 'Computer Lab 3',
    organizer: 'Cyber Club',
    hour: 13,
    minutes: 180,
    capacity: 40,
    tags: ['security', 'ethical-hacking'],
    description:
      'Find and fix common web vulnerabilities in a deliberately broken practice app.',
  },
  {
    title: 'Alumni Panel: Working Abroad',
    category: 'career',
    venue: 'Lecture Hall 1',
    organizer: 'Alumni Association',
    hour: 15,
    minutes: 90,
    capacity: 300,
    tags: ['alumni', 'careers'],
    description:
      'Alumni working in Singapore, Australia and Europe talk about visas, interviews and life abroad.',
  },
  {
    title: 'Open Source Contribution Day',
    category: 'hackathon',
    venue: 'Computer Lab 1',
    organizer: 'Open Source Club',
    hour: 9,
    minutes: 8 * 60,
    capacity: 70,
    tags: ['open-source', 'community'],
    description:
      'Pick a beginner-friendly issue in a real project and submit your first pull request with mentor help.',
  },
  {
    title: 'Tech Talk: Designing for Accessibility',
    category: 'talk',
    venue: 'Seminar Room',
    organizer: 'Design Circle',
    hour: 15,
    minutes: 60,
    capacity: 90,
    tags: ['accessibility', 'design'],
    description:
      'Why accessibility matters, how screen readers work, and quick wins you can ship in any app.',
  },
  {
    title: 'Movie Night: Hackers and Founders',
    category: 'social',
    venue: 'Open Air Theatre',
    organizer: 'Film Society',
    hour: 19,
    minutes: 150,
    capacity: 220,
    tags: ['movies', 'social'],
    description:
      'An outdoor screening of a tech documentary with popcorn. Bring a mat or a chair.',
  },
  {
    title: 'Mock Interview Day',
    category: 'career',
    venue: 'Seminar Room',
    organizer: 'Career Guidance Unit',
    hour: 9,
    minutes: 420,
    capacity: 80,
    tags: ['interviews', 'careers'],
    description:
      'Practise a technical and an HR interview with volunteers from industry, then get written feedback.',
  },
  {
    title: 'Web Performance Workshop',
    category: 'workshop',
    venue: 'Innovation Lab',
    organizer: 'IT Society',
    hour: 14,
    minutes: 150,
    capacity: 45,
    tags: ['web', 'performance'],
    description:
      'Measure, find and fix slow pages using browser tools. Bring a project you want to speed up.',
  },
  {
    title: 'End of Semester Social Night',
    category: 'social',
    venue: 'Faculty Courtyard',
    organizer: 'Student Union',
    hour: 18,
    minute: 30,
    minutes: 210,
    capacity: 300,
    registeredCount: 97,
    tags: ['social'],
    description:
      'Music, food and games to celebrate the end of the semester. Open to all FIT students and staff.',
  },
];

const users = [
  {
    id: 'u-001',
    name: 'Kasun Perera',
    email: 'student@fit.uom.lk',
    password: 'password123',
    batch: '22',
  },
];

function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function colomboToday() {
  return new Date(Date.now() + COLOMBO_OFFSET_MS).toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function toIso(dateString, totalMinutes) {
  const dayShift = Math.floor(totalMinutes / (24 * 60));
  const minuteOfDay = totalMinutes % (24 * 60);
  const date = addDays(dateString, dayShift);
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  return `${date}T${pad(hours)}:${pad(minutes)}:00${TIME_ZONE_OFFSET}`;
}

function createCheckInCode(random) {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  }
  return code;
}

function buildEvents() {
  const random = createRandom(2026);
  const today = colomboToday();
  const step = (LAST_EVENT_DAY - FIRST_EVENT_DAY) / (templates.length - 1);

  return templates.map((template, index) => {
    const id = `evt-${String(index + 1).padStart(3, '0')}`;
    const day = addDays(today, Math.round(FIRST_EVENT_DAY + index * step));
    const startMinutes = template.hour * 60 + (template.minute ?? 0);
    const registeredCount =
      template.registeredCount ??
      Math.round(template.capacity * (0.2 + random() * 0.7));

    return {
      id,
      title: template.title,
      description: template.description,
      category: template.category,
      startsAt: toIso(day, startMinutes),
      endsAt: toIso(day, startMinutes + template.minutes),
      venue: template.venue,
      organizer: template.organizer,
      imageUrl: `https://picsum.photos/seed/fit-${id}/800/450`,
      capacity: template.capacity,
      registeredCount,
      tags: template.tags,
      checkInCode: createCheckInCode(random),
    };
  });
}

const db = { events: buildEvents(), users };
const target = path.join(__dirname, 'db.json');
fs.writeFileSync(target, `${JSON.stringify(db, null, 2)}\n`);
console.log(`Wrote ${db.events.length} events to ${target}`);
