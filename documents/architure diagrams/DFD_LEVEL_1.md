# IBOP Level-1 Data Flow Diagram

This Level-1 DFD shows the main data movement in IBOP using only the core modules implemented in the project.

## Mermaid Diagram

```mermaid
flowchart LR
    U[Users\nAdmin / HR / Sales / Finance / Management]

    subgraph P[Core Processes]
        direction TB
        A[1.0 Authentication]
        I[2.0 Inventory Module]
        S[3.0 Sales Module]
        PU[4.0 Purchase Module]
        F[5.0 Finance Module]
        IN[6.0 Invoice Module]
    end

    D[(MongoDB Database\nemployees, products, sales, purchases, invoices, expenses)]

    U -->|login credentials| A
    A -->|session / access granted| U
    A -->|authenticated access| I
    A -->|authenticated access| S
    A -->|authenticated access| PU
    A -->|authenticated access| F
    A -->|authenticated access| IN

    I -->|product data / stock status| D
    D -->|inventory records| I

    S -->|sale transaction| D
    D -->|product details / saved sale| S
    S -->|stock update request| I
    I -->|available stock| S

    PU -->|purchase transaction| D
    D -->|saved purchase| PU
    PU -->|replenish stock| I
    PU -->|purchase expense data| F

    F -->|expense records| D
    D -->|expense history| F

    S -->|sale details for billing| IN
    IN -->|invoice record| D
    D -->|sale and invoice data| IN
    IN -->|invoice output| U

    classDef users fill:#f8fafc,stroke:#475569,stroke-width:1px,color:#0f172a;
    classDef process fill:#f0fdf4,stroke:#16a34a,stroke-width:1px,color:#0f172a;
    classDef datastore fill:#fff7ed,stroke:#c2410c,stroke-width:1px,color:#0f172a;

    class U users;
    class A,I,S,PU,F,IN process;
    class D datastore;
```

## Diagram Notes

- Users represent the authorized roles used in the project: Admin, HR, Sales, Finance, and Management.
- Authentication is shown as the entry point before users access the business modules.
- Inventory receives read and update flows from sales and purchases.
- Sales create transaction data and trigger inventory updates.
- Purchase activity replenishes inventory and sends expense-related information to finance.
- Invoice generation reads sale data and writes invoice records to the database.

## Relationship Summary

- Users authenticate once and then interact with the main business processes.
- All core modules exchange data with MongoDB.
- Sales and purchases both influence inventory levels.
- Finance stores and reads expense data.
- Invoices are generated from sale data and persisted in the database.