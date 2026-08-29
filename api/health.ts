export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: "ok",
    brand: "Heaven Furniture Mart",
    location: "Agrabad, Chattogram",
    timestamp: new Date().toISOString()
  });
}
