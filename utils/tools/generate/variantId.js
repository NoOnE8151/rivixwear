export function generateVariantId(colorName) {
  if (!colorName || typeof colorName !== "string") {
    throw new Error("colorName is required");
  }

  const formattedColor = colorName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  //random string
  const random = crypto.randomUUID().split("-")[0];

  return `variant_${formattedColor}_${random}`;
}