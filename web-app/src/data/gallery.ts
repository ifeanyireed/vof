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
    id: "academic-sponsorship-triad",
    title: "Academic Scholarships & School Sponsorship Awards",
    slug: "academic-scholarships-school-sponsorship",
    category: "Academic Scholarships",
    region: "Nigeria",
    year: 2026,
    location: "Nduo Eduo Secondary School, Okon-Eket & Partner Schools",
    photoCount: 18,
    description: "Official Veronica Onyeneke Foundation educational sponsorship, Spelling Bee competition awards, customized VOF school backpacks, notebooks, tuition aid, and excellence certificates.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_01_20260520-081024jpg1779555060.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_06_20260517-161722jpg1779555053.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_03_20260520-082059jpg1779555056.jpg"
    ],
    photos: [
      {
        id: "sch-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_01_20260520-081024jpg1779555060.jpg",
        caption: "Presentation of Certificates of Excellence and branded VOF backpacks to sponsored students by school leadership and VOF mentors.",
        date: "May 2026"
      },
      {
        id: "sch-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_06_20260517-161722jpg1779555053.jpg",
        caption: "Branded VOF backpacks, stationery sets, and official 1st Place Certificate of Excellence for the Nduo Eduo Secondary School Spelling Bee.",
        date: "May 2026"
      },
      {
        id: "sch-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_03_20260520-082059jpg1779555056.jpg",
        caption: "Proud student awardees holding their certificates, notebooks, and school bags alongside VOF field coordinators.",
        date: "May 2026"
      },
      {
        id: "sch-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_02_20260519-133944jpg1779555058.jpg",
        caption: "VOF youth mentor engaging with primary and junior secondary beneficiaries on the school grounds.",
        date: "May 2026"
      },
      {
        id: "sch-05",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/gallery/vof/vof_05_20260519-133833jpg1779555052.jpg",
        caption: "Group assembly of school teachers, academic mentors, and student scholarship recipients.",
        date: "May 2026"
      },
      {
        id: "sch-06",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_04_20260520-081032jpg1779555055.jpg",
        caption: "Classroom distribution of academic supplies and student recognition ceremony.",
        date: "May 2026"
      },
      {
        id: "sch-07",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233549/vof/gallery/vof/vof_30_whatsapp-image-2025-12-05-at-121313-am1764982619.jpg",
        caption: "Classroom visit where pupils expressed gratitude: 'Welcome Veronica Foundation, We Love You' inscribed on the board.",
        date: "December 2025"
      },
      {
        id: "sch-08",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_35_f57d4e8b-3d40-42d9-b745-fb271aa5f6421764859701.jpg",
        caption: "Presentation of ₦100,000 scholarship aid cheque to Anyanwu Esther C. for academic excellence in VOF educational competition.",
        date: "September 2025"
      }
    ]
  },
  {
    id: "maternal-care-outreach",
    title: "Maternal Dignity & Young Mothers Healthcare Outreach",
    slug: "maternal-dignity-young-mothers-outreach",
    category: "Maternal Dignity",
    region: "Nigeria",
    year: 2025,
    location: "Imo State & Healthcare Centers",
    photoCount: 12,
    description: "Compassionate maternal healthcare assistance, prenatal nutrition packages, home counseling visits, hospital bedside support, and emotional mentorship for young vulnerable expectant mothers.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233550/vof/gallery/vof/vof_33_whatsapp-image-2025-12-04-at-64739-am1764875879.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_36_img-20250331-wa00451763989231.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_34_whatsapp-image-2025-12-04-at-64737-am1764876034.jpg"
    ],
    photos: [
      {
        id: "mat-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233550/vof/gallery/vof/vof_33_whatsapp-image-2025-12-04-at-64739-am1764875879.jpg",
        caption: "Home visit and prenatal care counseling: VOF volunteers providing vital provisions, guidance, and emotional support to an expectant mother.",
        date: "December 2025"
      },
      {
        id: "mat-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_34_whatsapp-image-2025-12-04-at-64737-am1764876034.jpg",
        caption: "VOF maternal care coordinators standing with a supported young mother following prenatal check-in and dignity aid delivery.",
        date: "December 2025"
      },
      {
        id: "mat-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_36_img-20250331-wa00451763989231.jpg",
        caption: "Hospital ward bedside visitation: VOF volunteers assisting convalescing mothers and patients with compassionate presence and medical relief.",
        date: "March 2025"
      },
      {
        id: "mat-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_10_img-20260306-wa0272jpg1772862725.jpg",
        caption: "Young women enrolled in VOF life skills and self-reliance guidance circle.",
        date: "March 2026"
      }
    ]
  },
  {
    id: "community-food-relief",
    title: "Rural Food Security & Widows Empowerment Outreach",
    slug: "rural-food-security-widows-relief",
    category: "Community Relief",
    region: "Nigeria",
    year: 2025,
    location: "Imo State Rural Communities & Villages",
    photoCount: 42,
    description: "Large-scale community nutrition assistance delivering bags of rice, vegetable oil, cooking provisions, and foundation care boxes directly to rural widows, elderly mothers, and vulnerable households.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233550/vof/gallery/vof/vof_32_whatsapp-image-2025-11-11-at-054533-d3b31af11762981378.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_42_whatsapp-image-2025-11-11-at-054429-214922da1762981359.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_25_img-20260113-200232-8191768406965.jpg"
    ],
    photos: [
      {
        id: "com-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233550/vof/gallery/vof/vof_32_whatsapp-image-2025-11-11-at-054533-d3b31af11762981378.jpg",
        caption: "Flagship community outreach assembly: VOF team, clergy, and hundreds of rural widows gathered under canopies with stacked care packages.",
        date: "November 2025"
      },
      {
        id: "com-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_42_whatsapp-image-2025-11-11-at-054429-214922da1762981359.jpg",
        caption: "Elderly widows resting peacefully with their foundation food relief boxes during distribution.",
        date: "November 2025"
      },
      {
        id: "com-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_25_img-20260113-200232-8191768406965.jpg",
        caption: "Community group portrait of rural mothers and widows receiving commercial rice sacks and seasonal care packages.",
        date: "January 2026"
      },
      {
        id: "com-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233545/vof/gallery/vof/vof_22_whatsapp-image-2026-01-27-at-101606-am1769539779.jpg",
        caption: "VOF outreach director addressing village women with rows of tomato rice parcels queued for distribution.",
        date: "January 2026"
      },
      {
        id: "com-05",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233546/vof/gallery/vof/vof_21_whatsapp-image-2026-01-27-at-101558-am1769539819.jpg",
        caption: "Volunteer serving elderly community elders and widows with fresh garden produce and essential nutrition.",
        date: "January 2026"
      },
      {
        id: "com-06",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233550/vof/gallery/vof/vof_27_cbc99655-134d-410a-9df5-09fd1ab21c191767187701.jpg",
        caption: "Elderly mothers singing and giving praise joyfully with microphones during the community distribution session.",
        date: "January 2026"
      },
      {
        id: "com-07",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_39_whatsapp-image-2025-11-11-at-054430-dbeec2271762981367.jpg",
        caption: "VOF relief transport vehicle loaded with cooking oil, seasonings, and packaged foodstuffs ready for remote village routes.",
        date: "November 2025"
      },
      {
        id: "com-08",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_40_whatsapp-image-2025-11-11-at-054430-900133441762981364.jpg",
        caption: "Village widows celebrating with applause upon receiving their individual VOF care boxes.",
        date: "November 2025"
      },
      {
        id: "com-09",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233553/vof/gallery/vof/vof_44_whatsapp-image-2025-11-10-at-224628-2b11a5461762981353.jpg",
        caption: "VOF volunteer serving refreshments and care packs directly to women seated at the community center.",
        date: "November 2025"
      },
      {
        id: "com-10",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_50_whatsapp-image-2025-11-10-at-224624-2af2854d1762981333.jpg",
        caption: "Beneficiary roll call and verification roll under the community tent ensuring equitable allocation.",
        date: "November 2025"
      },
      {
        id: "com-11",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_51_whatsapp-image-2025-11-10-at-224623-294611601762981331.jpg",
        caption: "Direct home visit presenting emergency subsistence grant envelope to a homebound widow and her son.",
        date: "November 2025"
      },
      {
        id: "com-12",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233555/vof/gallery/vof/vof_53_whatsapp-image-2025-11-10-at-222825-bea296e41762981312.jpg",
        caption: "VOF field team reviewing delivery logs alongside stacked memorial relief boxes honoring Late Mrs. Veronica Onyeneke.",
        date: "November 2025"
      }
    ]
  },
  {
    id: "street-youth-charity-feeding",
    title: "Valentine's & Annual Street Children & Orphanage Relief",
    slug: "street-children-orphanage-charity-relief",
    category: "Community Relief",
    region: "Nigeria",
    year: 2026,
    location: "Urban Streets & Partner Children Homes",
    photoCount: 20,
    description: "On-the-street nutritional intervention, hot meal packaging, potable drinking water, and visits to vulnerable children homes and orphanages across city corridors.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_12_58211421951913523841772435094.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_49_whatsapp-image-2025-11-10-at-224624-a6d0bc861762981336.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_13_copy-of-fundraising-and-launch-of-veronica-onyeneke-institute-of-entreprene-20260217-203710-00001771408401.png"
    ],
    photos: [
      {
        id: "str-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_12_58211421951913523841772435094.jpg",
        caption: "Valentine's Day charity outreach: VOF volunteer handing freshly prepared warm meals and bottled water to street children.",
        date: "February 2026"
      },
      {
        id: "str-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_13_copy-of-fundraising-and-launch-of-veronica-onyeneke-institute-of-entreprene-20260217-203710-00001771408401.png",
        caption: "Distributing warm lunch packs to street youth and barrow pushers along commercial roads.",
        date: "February 2025"
      },
      {
        id: "str-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_14_copy-of-fundraising-and-launch-of-veronica-onyeneke-institute-of-entreprene-20260217-204147-00001771408313.png",
        caption: "Providing nourishment and dignity to vulnerable youngsters through nutritious warm meals.",
        date: "February 2025"
      },
      {
        id: "str-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_16_58211421951913523831772434972.jpg",
        caption: "Street outreach team coordinating food parcel handouts directly from the operations van.",
        date: "February 2026"
      },
      {
        id: "str-05",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_17_58211421951913523891772434941.jpg",
        caption: "Offering immediate relief and hydration to children in underserved areas.",
        date: "February 2026"
      },
      {
        id: "str-06",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233548/vof/gallery/vof/vof_18_copy-of-fundraising-and-launch-of-veronica-onyeneke-institute-of-entreprene-20260217-203857-00001771408092.png",
        caption: "Street youngsters enjoying their hot meals on the steps during the Valentine compassion mission.",
        date: "February 2025"
      },
      {
        id: "str-07",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_49_whatsapp-image-2025-11-10-at-224624-a6d0bc861762981336.jpg",
        caption: "Compassion visit to a children's home with Catholic Sisters, Rev. Charles Onyeneke, and volunteer team.",
        date: "November 2025"
      }
    ]
  },
  {
    id: "voie-vocational-youth-empowerment",
    title: "VOIE Practical Vocational Skills & Youth Cohorts",
    slug: "voie-vocational-skills-youth-cohorts",
    category: "Vocational Skills",
    region: "Nigeria",
    year: 2026,
    location: "VOIE Center & Imo State Workshops",
    photoCount: 16,
    description: "Practical vocational training cohorts, youth mentorship assemblies, entrepreneurship workshops, and community self-reliance programs at the Veronica Onyeneke Institute of Entrepreneurship.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_07_img-20260306-wa0260jpg1772862743.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_10_img-20260306-wa0272jpg1772862725.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_11_img-20260306-wa0274jpg1772862731.jpg"
    ],
    photos: [
      {
        id: "voie-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_07_img-20260306-wa0260jpg1772862743.jpg",
        caption: "VOIE youth empowerment participants and volunteer coordinators gathered outside the training complex.",
        date: "March 2026"
      },
      {
        id: "voie-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_10_img-20260306-wa0272jpg1772862725.jpg",
        caption: "Female trainees in the entrepreneurship and vocational empowerment track.",
        date: "March 2026"
      },
      {
        id: "voie-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233541/vof/gallery/vof/vof_11_img-20260306-wa0274jpg1772862731.jpg",
        caption: "Youth participants engaged in outdoor orientation and career development mentoring.",
        date: "March 2026"
      },
      {
        id: "voie-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_08_img-20260221-wa0059jpg1772862737.jpg",
        caption: "Skill acquisition candidate during entrance interview and orientation.",
        date: "February 2026"
      },
      {
        id: "voie-05",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233540/vof/gallery/vof/vof_09_img-20260306-wa0261jpg1772862735.jpg",
        caption: "VOIE trainee portrait following interactive coaching seminar.",
        date: "March 2026"
      }
    ]
  },
  {
    id: "vof-volunteer-corps-milestones",
    title: "VOF Volunteer Corps, Board Leadership & Annual Thanksgiving",
    slug: "vof-volunteer-corps-board-leadership",
    category: "Annual Milestones",
    region: "Global",
    year: 2025,
    location: "Spring Plaza, Owerri & International Chapters",
    photoCount: 22,
    description: "The dedicated men and women driving the Veronica Onyeneke Foundation forward: field volunteers, board trustees, community partners, and annual memorial celebrations honoring Mrs. Veronica Onyeneke.",
    coverImages: [
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233553/vof/gallery/vof/vof_48_whatsapp-image-2025-11-10-at-224625-0fa50d431762981338.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233549/vof/gallery/vof/vof_31_whatsapp-image-2025-12-05-at-43000-pm1764982110.jpg",
      "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_54_img-20260113-200230-6051768406484.jpg"
    ],
    photos: [
      {
        id: "vol-01",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233553/vof/gallery/vof/vof_48_whatsapp-image-2025-11-10-at-224625-0fa50d431762981338.jpg",
        caption: "The full VOF Volunteer Corps in signature green shirts, black caps, and white emblems surrounding stacked relief provisions.",
        date: "November 2025"
      },
      {
        id: "vol-02",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233554/vof/gallery/vof/vof_54_img-20260113-200230-6051768406484.jpg",
        caption: "Youth and diaspora volunteers relaxing and sharing reflections after a demanding field outreach.",
        date: "January 2026"
      },
      {
        id: "vol-03",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233549/vof/gallery/vof/vof_31_whatsapp-image-2025-12-05-at-43000-pm1764982110.jpg",
        caption: "VOF Board of Trustees, executive directors, and community leaders convening for strategic review.",
        date: "December 2025"
      },
      {
        id: "vol-04",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233551/vof/gallery/vof/vof_38_whatsapp-image-2025-11-11-at-054431-c9fae27d1762981370.jpg",
        caption: "Outreach coordinator delivering keynote directives to beneficiaries and partner organizations.",
        date: "November 2025"
      },
      {
        id: "vol-05",
        url: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233552/vof/gallery/vof/vof_41_whatsapp-image-2025-11-11-at-054430-64d9cfee1762981362.jpg",
        caption: "Reverend Father delivering prayer blessings and commencement dedication for foundation outreach operations.",
        date: "November 2025"
      }
    ]
  }
];
