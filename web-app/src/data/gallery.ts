export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  category: "Vocational Skills" | "Maternal Dignity" | "Academic Scholarships" | "Rwanda Mission" | "Community Relief" | "Annual Milestones";
  region: "Global" | "Nigeria" | "Rwanda" | "USA";
  year: number;
  location: string;
  photoCount: number;
  description: string;
  coverImages: [string, string, string]; // [topLeft, bottomLeft, rightTall]
  photos: GalleryPhoto[];
}

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "voie-fashion-trades",
    title: "VOIE Vocational Trades & Fashion Cohort",
    slug: "voie-vocational-trades-fashion-cohort",
    category: "Vocational Skills",
    region: "Nigeria",
    year: 2024,
    location: "VOIE Center, Owerri, Imo State",
    photoCount: 34,
    description: "Hands-on tailoring, modern garment construction, pattern drafting, and entrepreneurial workshop sessions at the Veronica Onyeneke Institute of Entrepreneurship.",
    coverImages: [
      "/IMG01.jpeg",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      "/IMG05.jpeg"
    ],
    photos: [
      {
        id: "v1",
        url: "/IMG01.jpeg",
        caption: "Students engaged in garment construction and tailoring masterclass at VOIE.",
        date: "August 2024"
      },
      {
        id: "v2",
        url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
        caption: "Measuring and drafting precision patterns on durable fabrics.",
        date: "August 2024"
      },
      {
        id: "v3",
        url: "/IMG05.jpeg",
        caption: "Graduation ceremony and presentation of sewing starter kits to certified alumni.",
        date: "September 2024"
      },
      {
        id: "v4",
        url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
        caption: "Technical design review and precision stitching exercises.",
        date: "July 2024"
      },
      {
        id: "v5",
        url: "/stats.jpeg",
        caption: "Instructors and student cohort displaying their finished creative garments.",
        date: "September 2024"
      }
    ]
  },
  {
    id: "maternal-care-outreach",
    title: "Vulnerable Young Mothers Care Outreach",
    slug: "vulnerable-young-mothers-care-outreach",
    category: "Maternal Dignity",
    region: "Nigeria",
    year: 2024,
    location: "Owerri & Surrounding Communities",
    photoCount: 14,
    description: "Compassionate maternal healthcare assistance, dignity packages, prenatal counseling, and mentorship to safeguard mothers and babies in vulnerable circumstances.",
    coverImages: [
      "/IMG03.jpeg",
      "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=800&q=80",
      "/IMG04.jpeg"
    ],
    photos: [
      {
        id: "m1",
        url: "/IMG03.jpeg",
        caption: "Prenatal health guidance and distribution of maternal dignity packages.",
        date: "June 2024"
      },
      {
        id: "m2",
        url: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1200&q=80",
        caption: "Compassionate counseling and mother-child nutritional wellness orientation.",
        date: "June 2024"
      },
      {
        id: "m3",
        url: "/IMG04.jpeg",
        caption: "Handing over essential infant items, clean clothing, and healthcare vouchers.",
        date: "July 2024"
      },
      {
        id: "m4",
        url: "/blog/womens-day.jpg",
        caption: "International Women's Day maternal dignity session with volunteer healthcare mentors.",
        date: "March 2024"
      }
    ]
  },
  {
    id: "academic-sponsorship-triad",
    title: "Academic Sponsorship & JAMB CBT Triad",
    slug: "academic-sponsorship-jamb-cbt-triad",
    category: "Academic Scholarships",
    region: "Nigeria",
    year: 2024,
    location: "Imo State & Partner Secondary Schools",
    photoCount: 56,
    description: "Intensive JAMB UTME prep bootcamps, secondary school fee coverage, and university scholarship awards for promising disadvantaged students.",
    coverImages: [
      "/IMG02.jpeg",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      "/blog/appreciation-aifue.jpg"
    ],
    photos: [
      {
        id: "a1",
        url: "/IMG02.jpeg",
        caption: "Secondary school students in sponsored CBT exam preparation classes.",
        date: "February 2024"
      },
      {
        id: "a2",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
        caption: "Peer study circles and university entrance coaching sessions.",
        date: "March 2024"
      },
      {
        id: "a3",
        url: "/blog/appreciation-aifue.jpg",
        caption: "Alvan Ikoku Federal University of Education student union scholarship presentation.",
        date: "April 2024"
      },
      {
        id: "a4",
        url: "/stats.jpeg",
        caption: "Beneficiaries of the 'Beyond the Degree' university scholarship program.",
        date: "May 2024"
      }
    ]
  },
  {
    id: "rwanda-school-partnerships",
    title: "VOF Rwanda School Supplies & Partners",
    slug: "vof-rwanda-school-supplies-partners",
    category: "Rwanda Mission",
    region: "Rwanda",
    year: 2024,
    location: "Kigali & Nyarurembo, Rwanda",
    photoCount: 53,
    description: "On-the-ground educational outreach providing school bags, notebooks, textbooks, and primary school tuition support for vulnerable children in Kigali.",
    coverImages: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      "/footer.jpeg"
    ],
    photos: [
      {
        id: "r1",
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        caption: "School distribution drive in Kigali providing essential learning materials.",
        date: "January 2024"
      },
      {
        id: "r2",
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        caption: "Classroom partnership activities engaging primary school students.",
        date: "January 2024"
      },
      {
        id: "r3",
        url: "/footer.jpeg",
        caption: "Happy children celebrating new academic resources and uniform supplies.",
        date: "February 2024"
      }
    ]
  },
  {
    id: "community-food-relief",
    title: "Rural Food Security & Widows Relief",
    slug: "rural-food-security-widows-relief",
    category: "Community Relief",
    region: "Nigeria",
    year: 2023,
    location: "Imo State Rural Communities",
    photoCount: 84,
    description: "Emergency nutrition support, rice bags, cooking oil, and vital relief parcels delivered directly to elderly widows and vulnerable households.",
    coverImages: [
      "/blog/easter-outreach.jpg",
      "/blog/valentines-outreach.jpg",
      "/IMG04.jpeg"
    ],
    photos: [
      {
        id: "c1",
        url: "/blog/easter-outreach.jpg",
        caption: "Easter community food parcels distribution to rural elderly widows.",
        date: "April 2023"
      },
      {
        id: "c2",
        url: "/blog/valentines-outreach.jpg",
        caption: "Valentine compassion outreach delivering household provisions and care packs.",
        date: "February 2023"
      },
      {
        id: "c3",
        url: "/IMG04.jpeg",
        caption: "Grassroots outreach team packaging food rations for remote villages.",
        date: "December 2023"
      }
    ]
  },
  {
    id: "aifue-beyond-degree",
    title: "AIFUE Beyond The Degree Convocation",
    slug: "aifue-beyond-the-degree-convocation",
    category: "Academic Scholarships",
    region: "Nigeria",
    year: 2023,
    location: "Alvan Ikoku Federal University, Owerri",
    photoCount: 33,
    description: "Honoring outstanding tertiary scholars, career mentorship seminars, and leadership recognition hosted with the Student Union Government.",
    coverImages: [
      "/blog/appreciation-aifue.jpg",
      "/stats.jpeg",
      "/hero.jpeg"
    ],
    photos: [
      {
        id: "b1",
        url: "/blog/appreciation-aifue.jpg",
        caption: "Student leadership presenting letter of commendation to VOF Trustees.",
        date: "October 2023"
      },
      {
        id: "b2",
        url: "/stats.jpeg",
        caption: "Undergraduate beneficiaries of academic tuition grants gathered on campus.",
        date: "October 2023"
      },
      {
        id: "b3",
        url: "/hero.jpeg",
        caption: "Keynote presentation on vocational leadership beyond university graduation.",
        date: "October 2023"
      }
    ]
  },
  {
    id: "voie-solar-electrical",
    title: "VOIE Solar & Electrical Installation Lab",
    slug: "voie-solar-electrical-installation-lab",
    category: "Vocational Skills",
    region: "Nigeria",
    year: 2023,
    location: "VOIE Engineering Workshop, Owerri",
    photoCount: 16,
    description: "Hands-on training in solar PV panel installation, inverter battery bank sizing, domestic conduit wiring, and clean energy troubleshooting.",
    coverImages: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      "/IMG01.jpeg"
    ],
    photos: [
      {
        id: "s1",
        url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        caption: "Solar technicians setting up photovoltaic roof brackets and wiring modules.",
        date: "November 2023"
      },
      {
        id: "s2",
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
        caption: "Testing electrical inverter battery banks and breaker panels for safety.",
        date: "November 2023"
      },
      {
        id: "s3",
        url: "/IMG01.jpeg",
        caption: "Classroom theoretical instruction on renewable solar energy engineering.",
        date: "October 2023"
      }
    ]
  },
  {
    id: "annual-thanksgiving-honor",
    title: "Annual Thanksgiving & Founder's Honor",
    slug: "annual-thanksgiving-founders-honor",
    category: "Annual Milestones",
    region: "Global",
    year: 2023,
    location: "Global Chapters & Owerri",
    photoCount: 25,
    description: "Celebrating the enduring legacy of Mrs. Veronica Onyeneke with trustees, volunteers, partners, and community members across Nigeria and the USA.",
    coverImages: [
      "/veronica.png",
      "/team/charles-onyeneke.jpg",
      "/hero.jpeg"
    ],
    photos: [
      {
        id: "t1",
        url: "/veronica.png",
        caption: "The cherished memory and inspiration: Late Mrs. Veronica Onyeneke.",
        date: "December 2023"
      },
      {
        id: "t2",
        url: "/team/charles-onyeneke.jpg",
        caption: "Founder Rev. Charles Onyeneke sharing the vision and future milestones of VOF.",
        date: "December 2023"
      },
      {
        id: "t3",
        url: "/hero.jpeg",
        caption: "Foundation trustees and community leaders reflecting on a year of transformational impact.",
        date: "December 2023"
      },
      {
        id: "t4",
        url: "/blog/annual-audit.jpg",
        caption: "Board meeting and presentation of annual financial transparency and stewardship audit.",
        date: "December 2023"
      }
    ]
  }
];
