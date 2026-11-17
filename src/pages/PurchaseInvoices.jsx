import { useBusinessData } from "../context/BusinessDataContext";
import { PageHeader, Card, SectionHeader } from "../components/Ui";
import { PurchaseTable } from "../components/purchases";
import "./Purchases.css";
function PurchaseInvoices() {
  const { purchases, receivePurchase, deletePurchase } = useBusinessData();
  return <>
    <PageHeader eyebrow="Supply Chain" title="Purchase Invoices" subtitle="Review supplier orders and record physically verified deliveries." />
    <Card><SectionHeader title="All Purchase Invoices" subtitle="Only confirmed received quantities are added to warehouse inventory." /><PurchaseTable purchases={purchases} onReceive={receivePurchase} onDelete={deletePurchase} /></Card>
  </>;
}
export default PurchaseInvoices;
