# IBOP System Architecture Diagram

This diagram reflects the current implementation of the Integrated Business Operations Platform (IBOP) repository.

## Mermaid Diagram

```mermaid
flowchart TD
    U[User / Employee] --> F[React Frontend<br/>Vite + React + Tailwind]
    F --> C[AuthContext<br/>Stores token and user]
    F --> B[BusinessDataProvider<br/>Fetches and updates business data]
    F --> A[Axios API Client<br/>Base URL /api<br/>Auto-attaches JWT]

    A --> S[Express Backend<br/>server.js]
    S --> M1[CORS Middleware]
    S --> M2[JSON Body Parser]
    S --> R[Route Mounting]

    R --> PR[Products API]
    R --> SR[Sales API]
    R --> IR[Invoices API]
    R --> PUR[Purchases API]
    R --> ER[Employees API]
    R --> EXR[Expenses API]

    PR --> PM[productRoutes<br/>protect + authorizeRoles]
    SR --> SM[saleRoutes<br/>protect + authorizeRoles]
    IR --> IM[invoiceRoutes<br/>protect + authorizeRoles]
    PUR --> PUM[purchaseRoutes<br/>protect + authorizeRoles]
    ER --> EM[employeeRoutes<br/>login public<br/>other routes protected]
    EXR --> XM[expenseRoutes<br/>protect + authorizeRoles]

    PM --> PC[productController]
    SM --> SC[saleController]
    IM --> IC[invoiceController]
    PUM --> PUC[purchaseController]
    EM --> EC[employeeController]
    XM --> XC[expenseController]

    PC --> PDB[(Products Collection)]
    SC --> SDB[(Sales Collection)]
    IC --> IDB[(Invoices Collection)]
    PUC --> PDB
    PUC --> EDB[(Expenses Collection)]
    EC --> EDB2[(Employees Collection)]
    XC --> EDB

    EC --> AUTH[JWT Authentication<br/>jsonwebtoken + bcryptjs]
    M1 --> ORG[CORS Origin Check]
    AUTH --> AR[Role Authorization<br/>Admin Management Sales Finance HR Supply Chain]

    B --> F1[Products State]
    B --> F2[Sales State]
    B --> F3[Invoices State]
    B --> F4[Purchases State]
    B --> F5[Employees State]
    B --> F6[Expenses State]

    F --> PAGES[Frontend Pages<br/>Dashboard Login Sales CreateSale Products Purchases Invoices Expenses Employees Modules]
    PAGES --> UI[Role-based UI<br/>ProtectedRoute + NavLink filtering]
    UI --> PDF[jsPDF Invoice Export]
    UI --> CHART[Recharts Dashboard Analytics]

    subgraph Business Logic
        SL[Sale Logic<br/>validate stock<br/>calculate discount<br/>apply 18% GST<br/>decrement product stock]
        PL[Purchase Logic<br/>calculate total<br/>apply GST<br/>update or create product<br/>auto-create expense]
        IL[Invoice Logic<br/>derive subtotal<br/>set due date<br/>toggle paid/unpaid]
        EL[Employee Logic<br/>auto-generate password<br/>hash with bcrypt<br/>issue JWT]
    end

    SC --> SL
    PUC --> PL
    IC --> IL
    EC --> EL
```

## Architecture Notes

- The frontend is a single-page React application built with Vite.
- Authentication state is persisted in localStorage and shared through AuthContext.
- Business data is loaded and synchronized through BusinessDataProvider.
- All API requests go through a shared Axios instance that injects the JWT token.
- The backend is an Express REST API with route-level role checks.
- MongoDB is accessed through Mongoose models for employees, products, sales, purchases, invoices, and expenses.
- Purchase creation automatically updates inventory and creates an expense record.
- Sale creation validates inventory and reduces product stock.
- Invoice records are derived from sale data and support PDF export on the frontend.
