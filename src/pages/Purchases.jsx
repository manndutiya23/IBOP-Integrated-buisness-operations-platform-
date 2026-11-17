import { useEffect, useMemo, useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import API from "../utils/axiosConfig";
import { Card, PageHeader, SectionHeader, SplitLayout } from "../components/Ui";
import { PurchaseForm, PurchaseKPIs, PurchaseTable } from "../components/purchases";
import "./Purchases.css";
const emptyLine = () => ({ productCatalogueId: "", quantity: "1", purchasePrice: "", gst: "0" });
function Purchases() {
  const { purchases, createPurchase, receivePurchase, deletePurchase } = useBusinessData();
  const [catalogue, setCatalogue] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState([emptyLine()]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { API.get("/product-catalogue").then((response) => setCatalogue(response.data)).catch((error) => console.error("PRODUCT LIST LOAD ERROR:", error)); }, []);
  const totalSpend = useMemo(() => purchases.reduce((sum, purchase) => sum + Number(purchase.finalAmount || 0), 0), [purchases]);
  const supplierCount = useMemo(() => new Set(purchases.map((purchase) => purchase.supplierName)).size, [purchases]);
  const averageOrderValue = purchases.length ? totalSpend / purchases.length : 0;
  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true);
    try { await createPurchase({ supplierName, date, items: lines.map((line) => ({ ...line, quantity: Number(line.quantity), purchasePrice: Number(line.purchasePrice), gst: Number(line.gst) })) }); setSupplierName(""); setDate(new Date().toISOString().slice(0, 10)); setLines([emptyLine()]); }
    catch (error) { alert(error.response?.data?.message || "Could not create purchase invoice."); }
    finally { setLoading(false); }
  };
  return <>
    <PageHeader eyebrow="Supply Chain" title="Purchase Invoices" subtitle="Create supplier purchase orders, then verify physical deliveries before stock enters inventory." />
    <PurchaseKPIs totalPurchases={purchases.length} totalSpend={totalSpend} supplierCount={supplierCount} averageOrderValue={averageOrderValue} />
    <SplitLayout><PurchaseForm catalogue={catalogue} supplierName={supplierName} setSupplierName={setSupplierName} date={date} setDate={setDate} lines={lines} setLines={setLines} handleSubmit={handleSubmit} loading={loading} /><Card><SectionHeader title="Purchase Invoices & Goods Receipt" subtitle="Track outstanding quantities and record only physically verified goods." /><PurchaseTable purchases={purchases} onReceive={receivePurchase} onDelete={deletePurchase} /></Card></SplitLayout>
  </>;
}
export default Purchases;
