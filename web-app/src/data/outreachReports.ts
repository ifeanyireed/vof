export interface OutreachBeneficiaryMetric {
  label: string;
  count: string;
}

export interface OutreachFinancialItem {
  item: string;
  amount: string;
}

export interface OutreachDocument {
  title: string;
  image: string;
  type: "report" | "award" | "flyer" | "photo";
}

export interface OutreachReport {
  id: string;
  title: string;
  slug: string;
  theme?: string;
  eventDate: string;
  year: number;
  venue: string;
  location: string;
  category: "Education & Scholarships" | "Vocational Training" | "Community Relief" | "Academic Competitions";
  summary: string;
  objectives: string[];
  keyActivities: string[];
  complianceAndObservations?: string[];
  nextSteps?: string[];
  impactMetrics: OutreachBeneficiaryMetric[];
  financials?: {
    totalReceived: string;
    totalSpent: string;
    items: OutreachFinancialItem[];
  };
  delegationAndVolunteers: { name: string; role: string }[];
  signedBy: {
    name: string;
    title: string;
  };
  documents: OutreachDocument[];
}

export const outreachReports: OutreachReport[] = [
  {
    id: "st-pauls-scholarship-launch-2026",
    title: "Launch of Scholarship, Partnership & Student Registration",
    slug: "st-pauls-scholarship-launch-2026",
    theme: "Secondary Academic Continuity & WAEC/NECO Coverage",
    eventDate: "July 16, 2026",
    year: 2026,
    venue: "Saint Paul's Catholic College, Umuezu-Igbosi",
    location: "Isiala Ngwa, Abia State, Nigeria",
    category: "Education & Scholarships",
    summary:
      "On Thursday, July 16, 2026, the Veronica Onyeneke Foundation officially established its educational sponsorship partnership with Saint Paul's Catholic College. The high-level engagement achieved two critical milestones: the formal execution of a Memorandum of Understanding (MoU) with the School Principal (Rev. Fr. Leo), and on-site physical verification, registration, and consent-signing for 10 brilliant indigent students.",
    objectives: [
      "Execute formal legal Memorandum of Understanding (MoU) with the school administration.",
      "Align scholarship scope to guarantee full tuition and WAEC/NECO external examination coverage for Senior Secondary levels (SS1–SS3).",
      "Administer double-page official student registration and parental consent forms.",
      "Capture promotional and accountability media assets for public stewardship reporting."
    ],
    keyActivities: [
      "MoU Execution: Official review, stamping, and signing of the operational framework by VOF Administrator and Principal Rev. Fr. Leo.",
      "Sponsorship Scope Alignment: Complete tuition and WAEC/NECO examination fees secured for 10 high-achieving indigent students.",
      "100% Parental Consent Collection: Attending parents and legal guardians appended physical signatures granting academic consent.",
      "On-site Document Vetting: Quality control ensuring zero missing data fields across all student registration files."
    ],
    complianceAndObservations: [
      "Parental Feedback: Parents expressed profound gratitude to the foundation, noting that timely sponsorship eliminates severe financial distress and prevents dropouts.",
      "Data Integrity: Submitted student forms and personal contacts were securely documented on-site for database integration."
    ],
    nextSteps: [
      "Digitize compiled student records into VOF Central Archives.",
      "Execute direct disbursement of tuition and levies to Saint Paul's Catholic College account ahead of resumption.",
      "Produce verified field promotional documentation."
    ],
    impactMetrics: [
      { label: "Selected Scholars", count: "10 Students" },
      { label: "Levels Covered", count: "SS1 – SS3" },
      { label: "Examinations Sponsored", count: "WAEC & NECO" },
      { label: "Parental Consent Rate", count: "100%" }
    ],
    delegationAndVolunteers: [
      { name: "Nwokorie Nora Chinwe", role: "VOF Global Administrator" },
      { name: "Rev. Fr. Leo Diala", role: "Principal, Saint Paul's Catholic College" }
    ],
    signedBy: {
      name: "Nwokorie Nora Chinwe",
      title: "Global Administrator, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Official Report — Page 1", image: "/outreach/img_00.jpg", type: "report" },
      { title: "Official Report — Page 2", image: "/outreach/img_01.jpg", type: "report" }
    ]
  },
  {
    id: "aifue-beyond-the-degree-2026",
    title: "2-Day Intensive Vocational Skills Training: 'Beyond the Degree'",
    slug: "aifue-beyond-the-degree-2026",
    theme: "Practical Chemical Products & Commercial Entrepreneurship",
    eventDate: "May 22 – 23, 2026",
    year: 2026,
    venue: "Alvan Ikoku Federal University of Education (AIFUE)",
    location: "Owerri, Imo State, Nigeria",
    category: "Vocational Training",
    summary:
      "In collaboration with the Student Union Government (SUG) of Alvan Ikoku Federal University of Education, VOF organized an intensive 2-Day Practical Vocational Skills Training Programme. The initiative empowered approximately 100 undergraduate students across various academic departments with hands-on skills in commercial production of liquid soap and Izal disinfectant from scratch.",
    objectives: [
      "Equip university undergraduates with practical, marketable trade skills alongside their academic degrees.",
      "Deliver hands-on chemical formulations training for liquid detergents and Izal germicide.",
      "Provide modern product packaging, branding, and commercialization mentoring.",
      "Present high-impact students with vocational empowerment certificates and seed guidance."
    ],
    keyActivities: [
      "Day 1: Comprehensive chemical raw material safety, formulation ratios, mixing methodologies, and disinfectant preparation demonstrations.",
      "Day 2: Hands-on student cohort batches, practical quality testing, container packaging, commercial label branding, and distribution marketing.",
      "Administrative Commendation: Keynote remarks by the Vice Chancellor's representative, Faculty Dean, and SUG Executives.",
      "Award of Merit Presentation: SUG Executive Council presented the Veronica Onyeneke Foundation with an Award of Merit in recognition of its unwavering youth empowerment investments."
    ],
    complianceAndObservations: [
      "Over 100 students actively participated with demonstrable chemical products manufactured on-site.",
      "SUG Vice President Comr. Okereke Stellamaris Chinaza issued an official university appreciation letter commending the VOF Board of Trustees."
    ],
    nextSteps: [
      "Establish campus entrepreneurial mentorship circle for graduates producing commercial detergents.",
      "Expand VOIE vocational starter toolkits to high-aptitude student beneficiaries."
    ],
    impactMetrics: [
      { label: "Students Trained", count: "100+ Scholars" },
      { label: "Trades Taught", count: "Soap & Disinfectant Making" },
      { label: "Institutional Recognition", count: "Award of Merit" },
      { label: "Program Duration", count: "2 Intensive Days" }
    ],
    delegationAndVolunteers: [
      { name: "Iwunwanne Stephanie Sochinazaekpere", role: "VOF Administrative Assistant" },
      { name: "H.E Comr. Okereke Stellamaris Chinaza", role: "SUG Vice President, AIFUE" },
      { name: "Prof. Stella Ngozi Lemchi (Rep.)", role: "Vice Chancellor, AIFUE" },
      { name: "Dr. Ekeh Martins", role: "Dean of Student Affairs, AIFUE" }
    ],
    signedBy: {
      name: "Iwunwanne Stephanie Sochinazaekpere",
      title: "Administrative Assistant, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Official Training Report — Page 1", image: "/outreach/img_03.jpg", type: "report" },
      { title: "Official Training Report — Page 2", image: "/outreach/img_04.jpg", type: "report" },
      { title: "SUG Official Appreciation Letter", image: "/outreach/img_07.jpg", type: "award" },
      { title: "Event Poster Banner", image: "/outreach/img_06.jpg", type: "flyer" }
    ]
  },
  {
    id: "nduo-eduo-spelling-bee-2026",
    title: "Nduo Eduo High School Academic Spelling Bee Competition",
    slug: "nduo-eduo-spelling-bee-2026",
    theme: "Promoting Literacy, Self-Confidence & Academic Excellence",
    eventDate: "May 20 – 21, 2026",
    year: 2026,
    venue: "Nduo Eduo High School, Okon Eket",
    location: "Eket, Akwa Ibom State, Nigeria",
    category: "Academic Competitions",
    summary:
      "VOF sponsored and coordinated a multi-stage Spelling Bee Competition for Junior Secondary students (JS1–JS3) at Nduo Eduo High School. The initiative promoted literacy, healthy academic rivalry, and student confidence beyond conventional classroom boundaries.",
    objectives: [
      "Stimulate vocabulary expansion and oral spelling mastery among junior secondary learners.",
      "Foster public speaking confidence and academic ambition.",
      "Reward academic excellence with durable educational materials and customized school supplies.",
      "Demonstrate 100% transparent itemized financial accounting of project disbursements."
    ],
    keyActivities: [
      "Three-stage progressive elimination rounds assessing complex vocabulary and spelling accuracy.",
      "Active participation of student cohorts with teachers and National Youth Service Corps (NYSC) members acting as judges.",
      "Official awards and certificates ceremony held before the entire school body during morning assembly on Thursday, May 21.",
      "1st Prize awarded to JS2 winner (Customized School Bag), with 2nd and 3rd Prizes (branded exercise books and quality pens) presented."
    ],
    impactMetrics: [
      { label: "Competition Stages", count: "3 Progressive Tiers" },
      { label: "Target Cohort", count: "Junior Secondary (JS1-JS3)" },
      { label: "Top Prize", count: "Customized School Bag" },
      { label: "Audited Budget", count: "₦34,100 NGN" }
    ],
    financials: {
      totalReceived: "₦32,000 NGN",
      totalSpent: "₦34,100 NGN",
      items: [
        { item: "Printing of competition rules, word lists & agenda", amount: "₦300" },
        { item: "Purchase of school bags (2 units)", amount: "₦20,000" },
        { item: "Customized embroidery & branding of bags", amount: "₦4,000" },
        { item: "Certificate printing & framing", amount: "₦1,800" },
        { item: "60-leaves exercise books", amount: "₦3,000" },
        { item: "Quality ballpoint pens (15 pieces)", amount: "₦1,500" },
        { item: "Decorative gift wrapping paper", amount: "₦200" },
        { item: "Refreshments for volunteer Corps members", amount: "₦3,300" }
      ]
    },
    delegationAndVolunteers: [
      { name: "Frances Uba", role: "VOF Project Coordinator" },
      { name: "NYSC Volunteer Corps Members", role: "Competition Proctors & Judges" }
    ],
    signedBy: {
      name: "Frances Uba",
      title: "Project Coordinator, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Spelling Bee Report & Financial Audit — Page 1", image: "/outreach/img_08.jpg", type: "report" },
      { title: "Spelling Bee Report & Financial Audit — Page 2", image: "/outreach/img_09.jpg", type: "report" }
    ]
  },
  {
    id: "national-jamb-sponsorship-2026",
    title: "2026 Nationwide JAMB UTME Registration Sponsorship",
    slug: "national-jamb-sponsorship-2026",
    theme: "Removing Tertiary Education Entry Barriers Across 7 States",
    eventDate: "March 4, 2026",
    year: 2026,
    venue: "Designated Accredited CBT Registration Centers Nationwide",
    location: "7 States across Nigeria (Imo, Abia, Lagos, Oyo, Kano, Nasarawa, Niger)",
    category: "Education & Scholarships",
    summary:
      "VOF provided 100% full funding for 17 selected disadvantaged candidates to register for the 2026 Unified Tertiary Matriculation Examination (UTME) conducted by the Joint Admissions and Matriculation Board (JAMB). The nationwide initiative mobilized dedicated volunteers across seven geopolitical states to assist beneficiaries throughout registration.",
    objectives: [
      "Eliminate financial distress preventing brilliant high-school graduates from attempting the JAMB UTME.",
      "Ensure geographical inclusion spanning Northern, Western, and Eastern Nigeria.",
      "Assign on-the-ground volunteer coordinators at accredited CBT registration hubs.",
      "Verify valid candidate biometric enrollment and profile verification."
    ],
    keyActivities: [
      "Beneficiary vetting and selection based on verifiable financial need and academic secondary transcripts.",
      "Direct disbursement of official JAMB e-PIN registration funds.",
      "Volunteer coordination in four key regions with parental collaboration in remaining states:",
      "• Imo State: Miss Chiziterem Gloria (9 beneficiaries)",
      "• Abia State: Mr. Evidence Nwazuo (2 beneficiaries)",
      "• Lagos State: Miss Juliet (2 beneficiaries)",
      "• Nasarawa State: Mr. Henry (1 beneficiary)",
      "• Oyo, Kano, and Niger States: 1 beneficiary each."
    ],
    impactMetrics: [
      { label: "Total Candidates Sponsored", count: "17 Candidates" },
      { label: "States Covered", count: "7 States" },
      { label: "State Breakdown", count: "Imo (9), Abia (2), Lagos (2), Others (4)" },
      { label: "Tuition / Fee Covered", count: "100% Full Exam Cost" }
    ],
    delegationAndVolunteers: [
      { name: "Chiziterem Gloria", role: "Admin Secretary & Imo Coordinator" },
      { name: "Mr. Evidence Nwazuo", role: "Abia State Volunteer Coordinator" },
      { name: "Mr. Henry", role: "Nasarawa State Volunteer Coordinator" },
      { name: "Miss Juliet", role: "Lagos State Volunteer Coordinator" }
    ],
    signedBy: {
      name: "Chiziterem Gloria",
      title: "Admin Secretary, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Official JAMB Sponsorship Report", image: "/outreach/img_11.jpg", type: "report" }
    ]
  },
  {
    id: "st-pauls-direct-fees-outreach-2025",
    title: "Educational Outreach & On-The-Spot School Fees Sponsorship",
    slug: "st-pauls-direct-fees-outreach-2025",
    theme: "Emergency Academic Intervention & Indigent Student Relief",
    eventDate: "November 15, 2025",
    year: 2025,
    venue: "St. Paul's Catholic School, Umueze Nvosi",
    location: "Isiala Ngwa South, Abia State, Nigeria",
    category: "Education & Scholarships",
    summary:
      "A five-member VOF delegation conducted an on-site educational intervention at St. Paul's Catholic School. After meeting with Principal Fr. Leo Diala and hosting an interactive student assembly on academic diligence, the foundation paid on-the-spot term school fees for three newly identified vulnerable students and rewarded academic quiz participants with learning supplies.",
    objectives: [
      "Review welfare of existing foundation scholar undergoing special language and academic training.",
      "Conduct inspirational youth talk on discipline, resilience, and educational perseverance.",
      "Identify urgent indigent student cases facing imminent withdrawal due to unpaid school fees.",
      "Pay direct school fees to the school administration on-site."
    ],
    keyActivities: [
      "Warm student welcome with handwritten cardboard appreciation signs and a student choir song.",
      "Principal Consultation: Fr. Leo Diala commended Foundation Founder Rev. Charles Onyeneke for relentless community upliftment.",
      "Motivational Keynote: Engr. Chris Lyke addressed the assembly on self-discipline, integrity, and hard work.",
      "On-the-spot Scholarship Award: Direct payment of one-term fees for 3 destitute students selected after rigorous criteria verification.",
      "Interactive Quiz & Gift Distribution: Students with correct answers received exercise books and stationery."
    ],
    impactMetrics: [
      { label: "Immediate Fee Coverage", count: "3 New Scholars" },
      { label: "Pre-existing Scholars", count: "1 Ongoing Special Track" },
      { label: "Stationery Distributed", count: "50+ Books & Pens" },
      { label: "Student Assembly", count: "Entire School Body" }
    ],
    delegationAndVolunteers: [
      { name: "Mr. Donatus", role: "Volunteer Coordinator (Aba)" },
      { name: "Engr. Chris Lyke", role: "Project Manager (Port Harcourt)" },
      { name: "Chiziterem Gloria", role: "Admin & Outreach Coordinator (Owerri)" },
      { name: "Miss Immaculata", role: "Social Media Manager (Aba)" },
      { name: "Miss Esther", role: "Content Creator (Owerri)" }
    ],
    signedBy: {
      name: "Uwakwe Gloria Chiziterem",
      title: "Admin Secretary / Outreach Coordinator, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Official Field Outreach Report", image: "/outreach/img_15.jpg", type: "report" }
    ]
  },
  {
    id: "valentine-feeding-streets-2026",
    title: "Valentine Outreach: 'Feeding the Streets & Sharing Love'",
    slug: "valentine-feeding-streets-2026",
    theme: "Feeding the Streets & Spreading Compassion Beyond Romance",
    eventDate: "February 14, 2026",
    year: 2026,
    venue: "High-Density Public Locations across Owerri Metropolis",
    location: "Owerri, Imo State, Nigeria",
    category: "Community Relief",
    summary:
      "On Valentine's Day 2026, a team of five VOF volunteers embarked on a street-level humanitarian relief drive across Owerri. The outreach focused on feeding vulnerable individuals, street workers, and destitute persons while distributing emergency cash gifts and conducting voice interviews on community love and compassion.",
    objectives: [
      "Reframe Valentine's Day around altruism, empathy, and service to humanity.",
      "Provide hot, nutritious meals and clean bottled water to persons in acute need on the streets of Owerri.",
      "Distribute direct cash gifts to relieve immediate economic hardship for struggling families.",
      "Capture vox-pop interviews highlighting community perspectives on unconditional love and kindness."
    ],
    keyActivities: [
      "Preparation and hygienic packaging of wholesome food rations.",
      "Mobile street distribution across key urban nodes in Owerri metropolis.",
      "Direct monetary token donations handed to elderly individuals, disabled persons, and vulnerable street vendors.",
      "Street interviews highlighting kindness, collective empathy, and community solidarity."
    ],
    impactMetrics: [
      { label: "Hot Meals Served", count: "150+ Portions" },
      { label: "Cash Gifts Distributed", count: "Direct Relief Grants" },
      { label: "Volunteer Crew", count: "5 Field Workers" },
      { label: "Scope", count: "Owerri Metropolis" }
    ],
    delegationAndVolunteers: [
      { name: "Miss Chiziterem Gloria", role: "Admin Secretary & Team Lead" },
      { name: "Miss Marycynthia", role: "Field Volunteer" },
      { name: "Miss Akira", role: "Field Volunteer" },
      { name: "Miss Esther", role: "Field Volunteer & Media" },
      { name: "Mrs. Ify", role: "Logistics Volunteer" }
    ],
    signedBy: {
      name: "Chiziterem Gloria",
      title: "Admin Secretary, Veronica Onyeneke Foundation"
    },
    documents: [
      { title: "Official Valentine Outreach Report", image: "/outreach/img_17.jpg", type: "report" },
      { title: "Outreach Campaign Flyer", image: "/outreach/img_18.jpg", type: "flyer" }
    ]
  }
];
