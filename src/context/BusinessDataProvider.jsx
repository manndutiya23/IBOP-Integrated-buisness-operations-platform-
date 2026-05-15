import { useState, useEffect } from "react";
import { BusinessDataContext } from "./BusinessDataContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export function BusinessDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("Management");
  const [purchases, setPurchases] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      // Map _id to id for frontend compatibility
      const mappedProducts = response.data.map((product) => ({
        ...product,
        id: product._id,
        batch: product.batchNumber,
        expiry: product.expiryDate,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sales`);
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/invoices`);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchases");

      setPurchases(res.data);
    } catch (error) {
      console.error("FETCH PURCHASES ERROR:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");

      setEmployees(res.data);
    } catch (error) {
      console.error("FETCH EMPLOYEES ERROR:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  // Fetch products from backend on component mount
  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
  fetchSales();
}, []);

useEffect(() => {
  fetchInvoices();
  fetchPurchases();
}, []);

useEffect(() => {
  fetchEmployees();
}, []);


const createSale = async (saleData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/sales",
      saleData
    );

    setSales((prev) => [...prev, res.data]); // 🔥 instant UI update
  } catch (err) {
    console.error("Error creating sale", err);
  }
};

  const addProduct = (product) => {
    setProducts((currentProducts) => [
      ...currentProducts,
      {
        id: Date.now(),
        ...product,
      },
    ]);
  };

  const createPurchase = async (purchaseData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/purchases",
      purchaseData
    );

    await fetchPurchases();
    await fetchProducts();
    await fetchExpenses();

    return res.data;

  } catch (error) {
    console.error("CREATE PURCHASE ERROR:", error);
  }
};


  const deleteProduct = async (id) => {
    try {
      // Find the product to get the _id if only id is provided
      const product = products.find((p) => p._id === id || p._id === id);
      if (!product) return;

      const mongoId = product._id || id;

      await axios.delete(`${API_BASE_URL}/products/${mongoId}`);
      setProducts((products) => products.filter((p) => p._id !== id && p._id !== mongoId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/sales/${id}`);
      setSales((sales) => sales.filter((s) => s._id !== id));
          } catch (error) {
      console.error("Failed to delete sale:", error);
    }
  };

  const addExpense = async (expense) => {
  try {
    const res = await axios.post("http://localhost:5000/api/expenses", expense);

    setExpenses((prev) => [...prev, res.data]);

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchExpenses();
}, []);

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/expenses/${id}`);
      setExpenses((current) => current.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const lowStockProducts = products.filter((p) => p.stock < 5);
  

  const updateProduct = async (updatedProduct) => {
    try {
      const product = products.find((p) => p._id === updatedProduct._id);
      if (!product) return;

      const mongoId = product._id;
      const mergedProduct = {
        ...product,
        ...updatedProduct,
      };

      // Prepare data for API (convert field names back)
      const apiData = {
        name: mergedProduct.name,
        price: mergedProduct.price,
        stock: mergedProduct.stock,
        batchNumber: mergedProduct.batch || mergedProduct.batchNumber,
        expiryDate: mergedProduct.expiry || mergedProduct.expiryDate,
      };

      const response = await axios.put(`${API_BASE_URL}/products/${mongoId}`, apiData);

      // Update local state with mapped data
      const mappedProduct = {
        ...response.data,
        id: response.data._id,
        batch: response.data.batchNumber,
        expiry: response.data.expiryDate,
      };

      setProducts((products) =>
        products.map((p) =>
          p._id === updatedProduct._id || p._id === mongoId ? mappedProduct : p
        )
      );
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

const createInvoice = async (sale) => {
  try {
   const subtotal = sale.totalPrice; 
  const gst = subtotal * 0.18;
  const finalAmount = subtotal + gst;
    const invoiceData = {
  saleId: sale._id,
  companyName: sale.companyName,
  productName: sale.productName,
  quantity: sale.quantity,
  rate: sale.rate,
  totalPrice: sale.totalPrice,

  subtotal,
  gst,
  finalAmount,

  status: "unpaid",
  date: sale.date,
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  
    console.log("SALE OBJECT:", sale);
    console.log("SENDING TO BACKEND:", invoiceData);
    await axios.post("http://localhost:5000/api/invoices", invoiceData);

    fetchInvoices();
  } catch (err) {
    console.error("CREATE INVOICE ERROR:", err);
  }
};

  const togglePayment = (id) => {
    setInvoices((current) =>
      current.map((inv) =>
        inv._id === id ? { ...inv, paid: !inv.paid } : inv
      )
    );
  };

  const toggleInvoiceStatus = async (invoiceId) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/invoices/${invoiceId}/status`
    );

    fetchInvoices();
  } catch (error) {
    console.error(
      "TOGGLE STATUS ERROR:",
      error
    );
  }
};

const addEmployee = async (employeeData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/employees",
      employeeData
    );

    const createdEmployee = res.data?.employee ?? res.data;
    setEmployees((prev) => [createdEmployee, ...prev]);

  } catch (error) {
    console.error("ADD EMPLOYEE ERROR:", error);
  }
};

const deleteEmployee = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/employees/${id}`
    );

    setEmployees((current) =>
      current.filter((e) => e._id !== id)
    );

  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);
  }
};


  return (
    <BusinessDataContext.Provider
      value={{
        products,
        sales,
        expenses,
        addProduct,
        createSale,
        deleteProduct,
        deleteSale,
        addExpense,
        deleteExpense,
        totalProducts,
        totalSales,
        totalRevenue,
        totalExpenses,
        profit,
        lowStockProducts,
        updateProduct,
        invoices,
        setInvoices,
        createInvoice,
        togglePayment,
        toggleInvoiceStatus,
        employees,
        setEmployees,
        addEmployee,
        deleteEmployee,
        role,
        setRole,
        purchases,
        createPurchase,
      }}
    >
      {children}
    </BusinessDataContext.Provider>
  );
}
