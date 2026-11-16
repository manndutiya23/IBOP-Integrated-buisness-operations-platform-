import { useMemo, useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import {
  Card,
  DataTable,
  EmptyState,
  Input,
  KPICard,
  PageHeader,
  PageSection,
  Select,
  StatusBadge,
} from "../components/Ui";
import "./ProductList.css";

const displayValue = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

function ProductList() {
  const { products = [] } = useBusinessData();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");

  const productTypes = useMemo(
    () => [...new Set(products.map((product) => product.productType).filter(Boolean))].sort(),
    [products]
  );

  const manufacturers = useMemo(
    () => [...new Set(products.map((product) => product.manufacturerDivision).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const searchable = [
        product.productCode,
        product.nick,
        product.name,
        product.manufacturerDivision,
        product.productType,
        product.hsnCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesType = typeFilter === "All" || product.productType === typeFilter;
      const matchesManufacturer =
        manufacturerFilter === "All" ||
        product.manufacturerDivision === manufacturerFilter;

      return matchesSearch && matchesType && matchesManufacturer;
    });
  }, [products, searchTerm, typeFilter, manufacturerFilter]);

  const missingHsnCount = products.filter((product) => !product.hsnCode).length;
  const manufacturerCount = manufacturers.length;
  const classifiedCount = products.filter((product) => product.productType).length;

  return (
    <div className="product-list-page">
      <PageHeader
        eyebrow="Supply Chain"
        title="Product List"
        subtitle="Browse the products Shrinath Enterprises deals in. Product catalogue records are separate from physical warehouse inventory."
      />

      <div className="product-list-page__metrics">
        <KPICard
          title="Products Listed"
          value={products.length.toLocaleString("en-IN")}
          subtitle="Product records available in IBOP"
          accent="brand"
          variant="compact"
        />
        <KPICard
          title="Manufacturers / Divisions"
          value={manufacturerCount.toLocaleString("en-IN")}
          subtitle="Distinct manufacturer entries"
          accent="blue"
          variant="compact"
        />
        <KPICard
          title="Product Types"
          value={productTypes.length.toLocaleString("en-IN")}
          subtitle={`${classifiedCount.toLocaleString("en-IN")} products classified`}
          accent="green"
          variant="compact"
        />
        <KPICard
          title="Missing HSN"
          value={missingHsnCount.toLocaleString("en-IN")}
          subtitle="Records requiring HSN review"
          accent={missingHsnCount ? "orange" : "green"}
          variant="compact"
        />
      </div>

      <PageSection
        title="Product Catalogue"
        subtitle={`${filteredProducts.length.toLocaleString("en-IN")} of ${products.length.toLocaleString("en-IN")} products`}
      >
        <Card className="product-list-page__filter-card" padding="compact">
          <div className="product-list-page__filters">
            <Input
              label="Search catalogue"
              type="search"
              placeholder="Product code, name, nickname, manufacturer or HSN"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Select
              label="Product type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All types</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Select
              label="Manufacturer / Division"
              value={manufacturerFilter}
              onChange={(event) => setManufacturerFilter(event.target.value)}
            >
              <option value="All">All manufacturers</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
              ))}
            </Select>
          </div>
        </Card>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="📋"
            title={products.length ? "No matching products" : "Product list is empty"}
            description={
              products.length
                ? "Try changing your search or filters."
                : "Product catalogue records will appear here once they are added to IBOP."
            }
          />
        ) : (
          <div className="product-list-page__table-card">
            <DataTable>
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Nickname</th>
                  <th>Manufacturer / Division</th>
                  <th>Type</th>
                  <th>HSN Code</th>
                  <th>GST</th>
                  <th>Record</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id || product.id || product.productCode || product.name}>
                    <td className="product-list-page__code">
                      {displayValue(product.productCode)}
                    </td>
                    <td className="product-list-page__name">
                      {displayValue(product.name)}
                    </td>
                    <td>{displayValue(product.nick)}</td>
                    <td>{displayValue(product.manufacturerDivision)}</td>
                    <td>{displayValue(product.productType)}</td>
                    <td className="product-list-page__code">
                      {displayValue(product.hsnCode)}
                    </td>
                    <td className="product-list-page__tax">
                      <span>IGST: {displayValue(product.igstRate)}%</span>
                      <span>CGST: {displayValue(product.cgstRate)}%</span>
                      <span>SGST: {displayValue(product.sgstRate)}%</span>
                    </td>
                    <td><StatusBadge variant="success">Listed</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        )}
      </PageSection>
    </div>
  );
}

export default ProductList;
