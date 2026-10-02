import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are "Stephanie", the warm, empathetic, and knowledgeable AI Assistant for the Veronica Onyeneke Foundation (VOF).
Your role is to assist visitors on the website by providing immediate, compassionate, and accurate information.

ABOUT VERONICA ONYENEKE FOUNDATION (VOF):
- Mission: Empowering lives and building resilient futures by supporting vulnerable young pregnant women and providing underprivileged youths with practical skills acquisition and academic scholarships.
- Founder & President: Rev. Fr. Charles Onyeneke (founded in loving memory of his late mother, Veronica Onyeneke).
- Key Program Pillars:
  1. Maternal Dignity & Young Mothers Care: Comprehensive prenatal healthcare orientation, maternal nutrition, maternity hospital delivery packs, emotional and mental health counseling for young pregnant mothers in vulnerable circumstances.
  2. Academic Triad Scholarships: Full tuition, textbooks, uniforms, and national exam registrations (WAEC, JAMB CBT) for secondary and university students (e.g. Saint Paul's Secondary School, Alvan Ikoku Federal University of Education, "Beyond the Degree").
  3. Vocational Skills Training (VOIE Center): Hands-on training in professional fashion design, garment construction, tailoring, footwear/leather craft, hairdressing/cosmetology, electrical/solar installation, catering, and computer/digital literacy at the VOIE Center in Owerri, Imo State, Nigeria. Certified alumni receive equipment starter packs (like sewing machines) upon graduation.
  4. Community Relief & Food Drives: Food staples, nutrition distribution, and seasonal relief drives in rural Imo and Abia State communities in Nigeria, as well as educational support missions in Kigali, Rwanda.
  5. Regional Hubs: Nigeria (HQ & VOIE Center), Rwanda (Kigali field coordination), USA (educational partner network).

DONATION & SUPPORT CHANNELS:
- Online Giving: Paystack (NGN debit/credit/transfers), Stripe (USD & International debit/credit), and PayPal.
- Direct Bank Transfers:
  * Nigeria (NGN): Access Bank | Account: 1851214066 | Name: Veronica Onyeneke Foundation
  * Nigeria (NGN): Zenith Bank | Account: 1310650942 | Name: Veronica Onyeneke Foundation (SWIFT: ZEIBNGLA)
  * Nigeria (NGN): GTBank | Account: 0923058866 | Name: Veronica Onyeneke Foundation (SWIFT: GTBINGLA)
  * Rwanda (RWF): Bank of Kigali | Account: 100147989392 | Name: Veronica Onyeneke Foundation
- Tax Deductibility: Transparently audited; donations through VOF Corp. in the USA are tax-deductible under 501(c)(3).

HOW VISITORS CAN GET INVOLVED:
- Apply for Scholarships / Skills: Visitors can click the "Apply" links on this site (/apply, /apply/scholarship, /apply/skills).
- Volunteer: Opportunities in field outreach, event coordination, mentorship, and digital skills (/apply/volunteer).
- Partner: Schools, corporate sponsors, and non-profits can submit partnership proposals.
- Contact: contact@vonf.org | Phone: +234 803 555 1201 (Nigeria) | +250 789 066 186 (Rwanda).

COMMUNICATION GUIDELINES:
- Warm, empathetic, respectful, and encouraging tone.
- Concise: Give clear, helpful answers in 2-4 sentences or short bullet points. Avoid overwhelming the visitor with long walls of text.
- If the visitor asks to speak to human support, let them know our support team is available and can also be reached at contact@vonf.org or +234 803 555 1201.`;

/**
 * Intelligent Knowledge Engine that answers queries accurately even if Gemini API is offline or unconfigured.
 */
export function getSmartKnowledgeReply(rawQuery: string): string {
  const query = rawQuery.toLowerCase().trim();

  // 1. Greetings & Identity
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|what's\s*up)/.test(query)) {
    return "Hello! I'm Stephanie, your VOF virtual assistant. Welcome to the Veronica Onyeneke Foundation! How can I assist you today? You can ask about our vocational training (VOIE), academic scholarships, maternal support, or how to donate and volunteer.";
  }

  if (query.includes('who are you') || query.includes('what is your name') || query.includes('who is stephanie') || query.includes('who is amina') || query.includes('who is staphanie')) {
    return "I am Stephanie, the AI assistant for the Veronica Onyeneke Foundation (VOF). I am here 24/7 to provide information on our charitable initiatives, scholarship opportunities, vocational training at the VOIE Center, maternal care programs, and donation details.";
  }

  // 2. Donation & Bank Details
  if (
    query.includes('donate') ||
    query.includes('donation') ||
    query.includes('bank') ||
    query.includes('account') ||
    query.includes('give') ||
    query.includes('paystack') ||
    query.includes('transfer') ||
    query.includes('paypal') ||
    query.includes('stripe') ||
    query.includes('zelle')
  ) {
    return `Thank you for your generous heart! You can donate to support VOF's community programs in several convenient ways:

💳 **Online Card / Transfer Giving:**
- Click the **"Donate Now"** button on our website to give securely via **Paystack** (NGN cards/USSD), **Stripe**, or **PayPal**.

🏦 **Direct Bank Transfers (Nigeria - NGN):**
- **Access Bank:** Account \`1851214066\` | Veronica Onyeneke Foundation
- **Zenith Bank:** Account \`1310650942\` (SWIFT: ZEIBNGLA)
- **GTBank:** Account \`0923058866\` (SWIFT: GTBINGLA)

🇷🇼 **Direct Bank Transfers (Rwanda - RWF):**
- **Bank of Kigali:** Account \`100147989392\`

🇺🇸 **United States Donors:**
- Contributions through Veronica Onyeneke Foundation Corp. are fully tax-deductible under 501(c)(3).

Every contribution directly funds student scholarships, prenatal kits, and vocational equipment!`;
  }

  // 3. Vocational Training & VOIE Institute
  if (
    query.includes('voie') ||
    query.includes('vocational') ||
    query.includes('skill') ||
    query.includes('trade') ||
    query.includes('fashion') ||
    query.includes('tailor') ||
    query.includes('catering') ||
    query.includes('solar') ||
    query.includes('starter pack') ||
    query.includes('hairdressing')
  ) {
    return `Through the **Veronica Onyeneke Institute of Entrepreneurship (VOIE)** in Mbieri/Owerri, Imo State, we empower young people with practical, hands-on trades:

✨ **Available Trade Tracks:**
- Fashion Design, Garment Construction & Pattern Making
- Footwear & Leather Goods Craft
- Hairdressing & Cosmetology
- Electrical & Solar Installation
- ICT & Digital Literacy
- Catering & Event Culinary Arts

🎓 **Starter Pack Empowerment:**
Upon graduation, certified trainees receive complete starter equipment (such as industrial sewing machines or toolkits) to launch their own independent businesses.

Applications open annually in January. You can learn more or register your interest at **/apply/skills**!`;
  }

  // 4. Academic Scholarships & School Sponsorship
  if (
    query.includes('scholarship') ||
    query.includes('school') ||
    query.includes('jamb') ||
    query.includes('waec') ||
    query.includes('tuition') ||
    query.includes('education') ||
    query.includes('student') ||
    query.includes('triad')
  ) {
    return `VOF runs the **Academic Sponsorship Triad** to eliminate financial barriers to education:

📚 **Three Levels of Sponsorship:**
1. **National Exam Sponsorship:** Full registration fees for secondary school graduates sitting for WAEC and JAMB CBT examinations.
2. **Secondary School Sponsorship:** Full tuition, textbooks, and school uniforms (such as our ongoing partner students at Saint Paul's Secondary School).
3. **University Scholarships ("Beyond the Degree"):** Multi-year tuition and textbook stipends for promising university and polytechnic undergraduates.

To submit your application or view the requirements, please visit **/apply/scholarship** or reach out to our education desk at **contact@vonf.org**.`;
  }

  // 5. Maternal Dignity & Young Pregnant Women
  if (
    query.includes('pregnant') ||
    query.includes('mother') ||
    query.includes('maternal') ||
    query.includes('baby') ||
    query.includes('prenatal') ||
    query.includes('dignity') ||
    query.includes('women')
  ) {
    return `Our **Supporting Young Vulnerable Pregnant Women** program provides compassionate, dignified care to young expectant mothers:

🌸 **How We Support Young Mothers:**
- Maternal healthcare referrals and clinical checkup support
- Free prenatal care packs and hygienic hospital delivery kits
- Emotional, psychological, and compassionate life mentorship
- Post-natal vocational starter grants so mothers can support their children with dignity

If you or someone you know needs confidential care and assistance, please contact us confidentially at **contact@vonf.org** or message us directly here.`;
  }

  // 6. Rwanda Mission
  if (query.includes('rwanda') || query.includes('kigali')) {
    return `🇷🇼 **VOF Rwanda Outreach:**
In Kigali and surrounding rural sectors, VOF operates community partnerships supporting vulnerable school children with uniforms and classroom supplies, while also assisting vulnerable young mothers with essential maternal care. 

For direct Rwanda inquiries, you can reach our Kigali coordination team at **+250 789 066 186** or **contact@vonf.org**.`;
  }

  // 7. Volunteer & Getting Involved
  if (query.includes('volunteer') || query.includes('join') || query.includes('help')) {
    return `We would love to welcome you into our community of changemakers! 

🤝 **Ways You Can Volunteer:**
- Field outreach and food distribution
- Mentorship and vocational training workshops
- Event logistics and medical/maternal mission support
- Digital media and community storytelling

You can register as an official VOF Volunteer by visiting **/apply/volunteer** or using the volunteer button in our footer.`;
  }

  // 8. Partnership & Corporate Alliances
  if (query.includes('partner') || query.includes('sponsor') || query.includes('csr') || query.includes('corporate')) {
    return `VOF welcomes institutional alliances with corporations, secondary/tertiary academic institutions, donor agencies, and faith-based groups. 

Our partnership tracks include **Vocational Training Starter Kit Sponsorship**, **Classroom Sponsorships**, and **Healthcare Outreach Sponsorships**. Please click "Submit Partnership Proposal" on our homepage or email our executive desk at **contact@vonf.org**.`;
  }

  // 9. Founder & History
  if (query.includes('founder') || query.includes('charles') || query.includes('who started') || query.includes('about')) {
    return `The Veronica Onyeneke Foundation was established by **Rev. Fr. Charles Onyeneke** in honor of his late mother, **Veronica Onyeneke**, whose life was defined by unconditional charity, compassion, and uplifting underprivileged families. 

Today, VOF operates across Nigeria (Owerri HQ), Rwanda (Kigali field coordination), and the United States (501(c)(3) partner branch).`;
  }

  // 10. Contact & Location
  if (
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('email') ||
    query.includes('address') ||
    query.includes('office') ||
    query.includes('location') ||
    query.includes('where')
  ) {
    return `📍 **Veronica Onyeneke Foundation Contact Details:**

- **Nigeria HQ & VOIE Institute:** Veronica Onyeneke Institute, Mbieri / Owerri, Imo State, Nigeria
- **USA Branch:** Veronica Onyeneke Foundation Corp. (501(c)(3) Nonprofit), Houston, TX
- **Rwanda Branch:** Kigali Field Coordination Center, Rwanda
- 📧 **Email:** contact@vonf.org
- 📞 **Phone:** +234 803 555 1201 (Nigeria) | +250 789 066 186 (Rwanda)

You can also send a message right here in this live chat anytime!`;
  }

  // General default fallback with foundation guidance
  return `Thank you for reaching out to the Veronica Onyeneke Foundation! 

I can assist you with:
- 🎓 **Vocational Training (VOIE Center):** Fashion, catering, solar installation, and starter kits.
- 📚 **Academic Scholarships:** WAEC/JAMB sponsorship and university grants.
- 🤱 **Maternal Care:** Support for young vulnerable expectant mothers.
- 💳 **Donations:** Online giving and bank accounts (Access Bank 1851214066).
- 🤝 **Volunteering & Partnerships:** Joining our outreach missions.

Please feel free to ask a specific question or leave your contact details so our team can follow up with you!`;
}

export async function generateChatbotReply(
  conversationHistory: Array<{ sender_type: string; content: string }>,
  latestUserMessage: string
): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';

  // If no Gemini API key configured, use our intelligent knowledge engine directly
  if (!apiKey || apiKey.trim() === '') {
    return getSmartKnowledgeReply(latestUserMessage);
  }

  // Format history for context
  const recentHistory = conversationHistory.slice(-8);
  const historyText = recentHistory
    .map(
      (m) =>
        `${m.sender_type === 'user' ? 'Visitor' : m.sender_type === 'staff' ? 'Support Staff' : 'AI Assistant'}: ${m.content}`
    )
    .join('\n');

  const prompt = `System Instructions:
${SYSTEM_PROMPT}

Previous conversation:
${historyText ? historyText : '(No prior messages)'}

Visitor's latest message:
"${latestUserMessage}"

Please provide your helpful, compassionate response to the visitor:`;

  // Standard official Gemini models
  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  try {
    const ai = new GoogleGenAI({ apiKey });

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const reply = response.text?.trim();
        if (reply) {
          return reply;
        }
      } catch (err: any) {
        console.warn(`Gemini generation on model ${modelName} failed:`, err?.message || err);
      }
    }
  } catch (initErr: any) {
    console.warn('Gemini client initialization error:', initErr?.message || initErr);
  }

  // Seamless fallback to our rich knowledge engine
  return getSmartKnowledgeReply(latestUserMessage);
}
