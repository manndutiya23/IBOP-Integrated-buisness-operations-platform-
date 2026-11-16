import ProductCatalogue from "../models/ProductCatalogue.js";

/**
 * Read-only catalogue endpoint.
 * Catalogue records are not warehouse inventory and do not carry stock.
 */
export const getProductCatalogue = async (req, res) => {
  try {
    const products = await ProductCatalogue.find({})
      .select(
        "productCode name nick manufacturerDivision productType hsnCode igstRate cgstRate sgstRate createdAt updatedAt"
      )
      .collation({ locale: "en", strength: 2 })
      .sort({ productCode: 1 })
      .lean();

    res.set("Cache-Control", "private, no-store");
    return res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCT CATALOGUE ERROR:", error);
    return res.status(500).json({
      message: "Unable to fetch product catalogue",
    });
  }
};
