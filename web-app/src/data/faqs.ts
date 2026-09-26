export interface FAQItem {
  id: string;
  category: 'General' | 'Maternal Care' | 'Skills & VOIE' | 'Scholarships' | 'Donations & Tax';
  q: string;
  a: string | string[];
}

export const FAQ_CATEGORIES = [
  'All',
  'Maternal Care',
  'Skills & VOIE',
  'Scholarships',
  'Donations & Tax',
  'General'
] as const;

export const faqItems: FAQItem[] = [
  {
    id: 'maternal-support',
    category: 'Maternal Care',
    q: 'How does VOF assist young pregnant women?',
    a: 'VOF supports young pregnant women by helping them return to education where possible or providing opportunities to acquire practical skills through the Veronica Onyeneke Institute of Entrepreneurship (VOIE). These opportunities are designed to help them become self-reliant, provide for their children, and build a more secure future with dignity and maternal health protection.'
  },
  {
    id: 'child-protection',
    category: 'Maternal Care',
    q: 'How does VOF support the children of young mothers?',
    a: [
      'VOF first seeks to work with the young mother and her family, particularly the grandparents, to encourage them to accept and support the child within the family structure.',
      'Where the family is unable or unwilling to take the child home, and with the informed consent of the young mother and the involvement of the Foundation\'s Legal Representative, VOF may arrange temporary care and protection for the child through an appropriate and legally recognised child-care institution.',
      'This is not abandonment or permanent separation. The arrangement is intended to provide the child with proper care, protection, and support while the mother is being helped to regain stability and prepare to take responsibility for her child. VOF remains concerned about the child\'s welfare throughout the period of temporary care and will support the mother towards safe and appropriate reunification when she is ready and able to care for her child.'
    ]
  },
  {
    id: 'voie-fees',
    category: 'Skills & VOIE',
    q: 'Does the Veronica Onyeneke Institute of Entrepreneurship provide free education?',
    a: 'The Veronica Onyeneke Institute of Entrepreneurship does not operate as a completely free educational institution. However, the Veronica Onyeneke Foundation provides full and partial scholarships to vulnerable young people who may otherwise be unable to afford the cost of training. Scholarship support is provided based on verified financial need and available resources.'
  },
  {
    id: 'skills-application',
    category: 'Skills & VOIE',
    q: 'How can I apply for the Skills Acquisition Programme? Is the programme open throughout the year?',
    a: [
      'Applications for the Skills Acquisition Programme are submitted through the Foundation\'s official website. The programme does not operate on a year-round open application basis.',
      'Applications open once a year, typically from the second week to the third week of January, after which shortlisted applicants are invited for an interview and workshop orientation.',
      'Applicants are encouraged to monitor the Foundation\'s website and official communication channels for application opening dates, admission criteria, and required documentation.'
    ]
  },
  {
    id: 'scholarship-eligibility',
    category: 'Scholarships',
    q: 'Who is eligible to apply for VOF Educational Scholarships?',
    a: [
      'VOF offers academic sponsorships across three tiers: Secondary School Tuition & Books, JAMB/UTME Registration Fees, and Tertiary University Grants for underprivileged youths in Nigeria and Rwanda.',
      'Eligibility is assessed based on genuine financial hardship, academic determination, and recommendation letters from local school heads, community leaders, or parish priests.',
      'Applications can be submitted via the online Scholarship portal or through official school partnership outreach visits conducted by our field teams.'
    ]
  },
  {
    id: 'tax-deductible',
    category: 'Donations & Tax',
    q: 'Are donations to Veronica Onyeneke Foundation tax-deductible?',
    a: 'Yes. Donations made through Veronica Onyeneke Foundation Corp. (our U.S. branch) are fully tax-deductible under Section 501(c)(3) of the United States Internal Revenue Code. U.S. donors receive an official tax substantiation receipt for federal income tax filing.'
  },
  {
    id: 'bank-swift-codes',
    category: 'Donations & Tax',
    q: 'What are VOF bank details and SWIFT codes for international wire transfers?',
    a: [
      'International and direct bank donors can transfer funds to our verified institutional accounts:',
      '• Guaranty Trust Bank (GTBank): Account 0923058866 | SWIFT CODE: GTBINGLA',
      '• Zenith Bank: Account 1310650942 | SWIFT CODE: ZEIBNGLA',
      '• Bank of Kigali (Rwanda Hub): Account 100267865048 | IBAN: RW34040100267865048646 | Currency: RWF',
      '• Account Name: Veronica Onyeneke Foundation',
      'Wire transfers can be designated for specific programs: Pregnant Women Support, Youth Vocational Empowerment, or Education Sponsorship.'
    ]
  },
  {
    id: 'entity-structure',
    category: 'General',
    q: 'What is the relationship between VOF Nigeria, VOF Corp (USA), and VOF Rwanda?',
    a: 'All three entities operate under the shared vision of Rev. Fr. Charles Onyeneke. VOF Nigeria serves as the global head office and vocational training hub (VOIE) in Owerri, Imo State; VOF Corp. in Aurora, Colorado, provides an international 501(c)(3) donor and partnership platform; and VOF Rwanda in Kigali directs local school partnerships, maternal assistance, and community outreach in Rwanda.'
  },
  {
    id: 'fund-governance',
    category: 'Donations & Tax',
    q: 'How are donated funds allocated and accounted for?',
    a: 'VOF adheres to strict financial governance and annual audit readiness. Contributions directly fund student tuition/JAMB fees, vocational toolkits at VOIE (such as sewing machines, solar kits, and salon tools), prenatal supplies for young expectant mothers, and grassroots community outreach. No administrative overhead dilutes dedicated project funds.'
  },
  {
    id: 'volunteer-opportunities',
    category: 'General',
    q: 'How can professionals and students volunteer with VOF?',
    a: 'Volunteers can join our teams in Nigeria, Rwanda, and the United States or contribute remotely. Opportunities include vocational instructors at VOIE, healthcare counselors for young expectant mothers, academic tutors, event organizers, and digital media advocates. You can register anytime through the Volunteer portal on this website.'
  }
];
