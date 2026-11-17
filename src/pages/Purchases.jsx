import { useEffect, useMemo, useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import API from "../utils/axiosConfig";
import { PageHeader } from "../components/Ui";
import { PurchaseForm, PurchaseKPIs } from "../components/purchases";
import "./Purchases.css";

const emptyLine = () => ({ productCatalogueId: "", quantity: "1", purchasePrice: "", gst: "0" });

function Purchases() {
  const { purchases, createPurchase } = useBusinessData();
  const [catalogue, setCatalogue] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState([emptyLine()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([API.get("/product-catalogue"), API.get("/manufacturers")])
      .then(([catalogueResponse, supplierResponse]) => { setCatalogue(catalogueResponse.data); setSuppliers(supplierResponse.data); })
      .catch((error) => console.error("PURCHASE FORM DATA LOAD ERROR:", error));
  }, []);

  const totalSpend = useMemo(
    () => purchases.reduce((sum, purchase) => sum + Number(purchase.finalAmount || 0), 0),
    [purchases]
  );
  const supplierCount = useMemo(
    () => new Set(purchases.map((purchase) => purchase.supplierName)).size,
    [purchases]
  );
  const averageOrderValue = purchases.length ? totalSpend / purchases.length : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createPurchase({
        supplierId: supplierName,
        date,
        items: lines.map((line) => ({
          ...line,
          quantity: Number(line.quantity),
          purchasePrice: Number(line.purchasePrice),
          gst: Number(line.gst),
        })),
      });
      setSupplierName("");
      setDate(new Date().toISOString().slice(0, 10));
      setLines([emptyLine()]);
    } catch (error) {
      alert(error.response?.data?.message || "Could not create purchase invoice.");
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageHeader
      eyebrow="Supply Chain"
      title="Order Inventory"
      subtitle="Create supplier purchase orders, then verify physical deliveries before stock enters inventory."
    />
    <PurchaseKPIs
      totalPurchases={purchases.length}
      totalSpend={totalSpend}
      supplierCount={supplierCount}
      averageOrderValue={averageOrderValue}
    />
    <PurchaseForm
      catalogue={catalogue}
      suppliers={suppliers}
      supplierName={supplierName}
      setSupplierName={setSupplierName}
      date={date}
      setDate={setDate}
      lines={lines}
      setLines={setLines}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  </>;
}

export default Purchases;
