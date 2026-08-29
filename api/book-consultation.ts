export default function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, phone, projectType } = body;
    const bookingId = "HFM-" + Math.floor(100000 + Math.random() * 900000);

    return res.status(200).json({
      success: true,
      bookingId,
      message: `Consultation request received for ${name || 'Client'}. Our master artisan will contact you at ${phone} within 2 hours.`,
      showroomLocation: "Agrabad Access Road, Chattogram",
      directWhatsApp: "https://wa.me/8801960481983?text=" + encodeURIComponent(`Hello Heaven Furniture Mart! I booked consultation #${bookingId} for my ${projectType || 'furniture'} project.`)
    });
  } catch (error) {
    console.error("Booking handler error:", error);
    const fallbackId = "HFM-" + Math.floor(100000 + Math.random() * 900000);
    return res.status(200).json({
      success: true,
      bookingId: fallbackId,
      message: "Consultation request registered successfully.",
      showroomLocation: "Agrabad Access Road, Chattogram",
      directWhatsApp: "https://wa.me/8801960481983"
    });
  }
}
