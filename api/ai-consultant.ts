export default async function handler(req: any, res: any) {
  // Support CORS and preflight if called cross-origin
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { roomType, dimensions, stylePreference, woodChoice, budgetRange, specialNeeds } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful high-quality architectural blueprint fallback
      return res.status(200).json({
        success: true,
        recommendation: {
          conceptName: `Bespoke ${woodChoice || "Chittagong Teak"} ${roomType || "Living"} Suite`,
          designPhilosophy: `Crafted specifically for your ${dimensions || "custom space"} with a refined ${stylePreference || "Modern Luxury"} aesthetic. Engineered with seasoned timber to thrive in Chattogram's coastal humidity with zero warping.`,
          timberSpecification: `${woodChoice || "Grade-A Chittagong Teak (Segun)"}, moisture-cured for 60 days, finished in hand-rubbed Danish oil and matte polyurethane seal.`,
          recommendedLayout: [
            "Floating focal piece oriented towards natural ambient lighting",
            "Concealed cable management routing for pristine minimal lines",
            "Ergonomically tuned seating angles (105° recline with high-resilience memory foam)",
            "Accented with brushed champagne brass trims matching Heaven signature joinery"
          ],
          estimatedPriceRangeBDT: budgetRange === "Luxury Exclusive" ? "৳ 1,80,000 – ৳ 3,50,000" : "৳ 85,000 – ৳ 1,60,000",
          craftingTimeDays: "18 - 25 business days",
          nextStep: "Bring this concept to our Agrabad showroom or book a master craftsman home measurement."
        }
      });
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the Master Bespoke Furniture Artisan and Interior Architect at 'Heaven Furniture Mart', Chattogram's premier luxury bespoke furniture studio located on Agrabad Access Road, founded in 2020 by Abul Kalam Bhuiyan.
    
    A client is requesting a custom furniture & interior design concept for their home in Bangladesh.
    Client Specifications:
    - Room Type: ${roomType || "Living Room"}
    - Dimensions / Space: ${dimensions || "Standard residential layout"}
    - Preferred Style: ${stylePreference || "Warm Editorial Luxury"}
    - Wood / Material Preference: ${woodChoice || "Chittagong Teak / Segun"}
    - Budget Tier: ${budgetRange || "Premium Bespoke"}
    - Special Notes: ${specialNeeds || "Durability, comfort, aesthetic beauty"}

    Provide a sophisticated, editorial, and realistic response in JSON format with:
    1. conceptName (e.g. 'The Agrabad Presidential Teak Suite' or 'Nasirabad Minimalist Dining Enclave')
    2. designPhilosophy (2 sentences on why this tailored design elevates their lifestyle and handles Bangladesh climate)
    3. timberSpecification (detailed wood, joinery, and finish specs)
    4. recommendedLayout (array of 3-4 specific architectural design recommendations)
    5. estimatedPriceRangeBDT (realistic Bangladeshi Taka range, e.g. '৳ 95,000 - ৳ 1,80,000')
    6. craftingTimeDays (e.g. '18 - 24 business days')
    7. nextStep (inspiring invitation to view material samples at Agrabad showroom or connect on WhatsApp)

    Output STRICTLY pure JSON without markdown backticks.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    let cleanJson = text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleanJson);
    return res.status(200).json({ success: true, recommendation: parsed });
  } catch (error) {
    console.error("AI Consultant error:", error);
    return res.status(200).json({
      success: true,
      recommendation: {
        conceptName: "Bespoke Heaven Masterpiece Suite",
        designPhilosophy: "Precision tailored to your exact floorplan, utilizing seasoned Chittagong Teak and architectural joinery for lifelong durability.",
        timberSpecification: "Grade-A Solid Teak (Segun) with hand-stitched Belgian upholstery and brushed brass hardware.",
        recommendedLayout: [
          "Custom scaled proportions matching room ceiling height",
          "Balanced negative space for effortless airflow and luxury atmosphere",
          "Concealed internal framing with lifetime structural warranty"
        ],
        estimatedPriceRangeBDT: "৳ 90,000 – ৳ 2,20,000",
        craftingTimeDays: "20 business days",
        nextStep: "Connect with our design director at +880 1960-481983 or visit Agrabad Access Road showroom."
      }
    });
  }
}
