import { useEffect, useMemo, useState } from "react";
import API from "../utils/axiosConfig";
import {
  Card,
  DataTable,
  EmptyState,
  Input,
  KPICard,
  LoadingSpinner,
  PageHeader,
  PageSection,
  Select,
  StatusBadge,
} from "../components/Ui";
import "./ProductList.css";

const displayValue = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");

  useEffect(() => {
    let active = true;

    const loadCatalogue = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/product-catalogue");
        if (active) {
          setProducts(Array.isArray(response.data) ? response.data : []);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.status === 403
              ? "Your account does not have permission to view the product catalogue."
              : requestError.response?.data?.message ||
                  "Could not load the product catalogue. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCatalogue();
    return () => {
      active = false;
    };
  }, []);

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

      return (
        (!query || searchable.includes(query)) &&
        (typeFilter === "All" || product.productType === typeFilter) &&
        (manufacturerFilter === "All" ||
          product.manufacturerDivision === manufacturerFilter)
      );
    });
  }, [products, searchTerm, typeFilter, manufacturerFilter]);

  const missingHsnCount = products.filter((product) => !product.hsnCode).length;
  const classifiedCount = products.filter((product) => product.productType).length;

  return (
    <div className="product-list-page">
      <PageHeader
        eyebrow="Supply Chain"
        title="Product List"
        subtitle="Browse the products Shrinath Enterprises deals in. This catalogue is separate from physical warehouse inventory."
      />

      <div className="product-list-page__metrics">
        <KPICard
          title="Products Listed"
          value={loading ? "—" : products.length.toLocaleString("en-IN")}
          subtitle="Approved catalogue records"
          accent="brand"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Manufacturers / Divisions"
          value={loading ? "—" : manufacturers.length.toLocaleString("en-IN")}
          subtitle="Distinct catalogue entries"
          accent="blue"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Product Types"
          value={loading ? "—" : productTypes.length.toLocaleString("en-IN")}
          subtitle={loading ? "Loading catalogue" : `${classifiedCount.toLocaleString("en-IN")} products classified`}
          accent="green"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Missing HSN"
          value={loading ? "—" : missingHsnCount.toLocaleString("en-IN")}
          subtitle="Records requiring HSN review"
          accent={missingHsnCount ? "orange" : "green"}
          variant="compact"
          loading={loading}
        />
      </div>

      <PageSection
        title="Product Catalogue"
        subtitle={loading ? "Loading product records…" : `${filteredProducts.length.toLocaleString("en-IN")} of ${products.length.toLocaleString("en-IN")} products`}
      >
        {error ? (
          <Card className="product-list-page__error">
            <div role="alert">{error}</div>
          </Card>
        ) : loading ? (
          <LoadingSpinner label="Loading product catalogue…" />
        ) : (
          <>
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
                title={products.length ? "No matching products" : "Product catalogue is empty"}
                description={
                  products.length
                    ? "Try changing your search or filters."
                    : "The catalogue collection is ready. Product records will appear after the approved catalogue import."
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
                      <tr key={product._id || product.productCode}>
                        <td className="product-list-page__code">{displayValue(product.productCode)}</td>
                        <td className="product-list-page__name">{displayValue(product.name)}</td>
                        <td>{displayValue(product.nick)}</td>
                        <td>{displayValue(product.manufacturerDivision)}</td>
                        <td>{displayValue(product.productType)}</td>
                        <td className="product-list-page__code">{displayValue(product.hsnCode)}</td>
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
          </>
        )}
      </PageSection>
    </div>
  );
}

export default ProductList;
