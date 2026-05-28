# IBOP Level-1 Data Flow Diagram

This Level-1 DFD presents the Integrated Business Operations Platform (IBOP) developed for Shrinath Enterprises. It focuses on the main business processes and their interaction with users and the MongoDB database.

## Mermaid Code

```mermaid
flowchart LR
    U[Users<br/>Admin, HR, Sales, Finance, Management]

    A[Authentication Module]

    subgraph B[Business Modules]
        direction TB
        I[Inventory Module]
        S[Sales Module]
        P[Purchase Module]
        F[Finance Module]
        IN[Invoice Module]
    end

    D[(MongoDB Database)]

    U -->|Login credentials| A
    A -->|Session access| U

    A -->|Authenticated access| I
    A -->|Authenticated access| S
    A -->|Authenticated access| P
    A -->|Authenticated access| F
    A -->|Authenticated access| IN

    I <-->|Product data / stock status| D
    S <-->|Sale records / product details| D
    P <-->|Purchase records / inventory data| D
    F <-->|Expenses / analytics data| D
    IN <-->|Invoice data / sale details| D

    S -->|Update stock| I
    P -->|Replenish stock| I
    P -->|Expense entry| F
    S -->|Generate invoice| IN
    IN -->|Invoice output| U

    classDef users fill:#f8fafc,stroke:#64748b,stroke-width:1px,color:#0f172a;
    classDef auth fill:#ecfeff,stroke:#0891b2,stroke-width:1px,color:#0f172a;
    classDef module fill:#f0fdf4,stroke:#16a34a,stroke-width:1px,color:#0f172a;
    classDef db fill:#fff7ed,stroke:#c2410c,stroke-width:1px,color:#0f172a;

    class U users;
    class A auth;
    class I,S,P,F,IN module;
    class D db;
```

## Diagram Notes

- The layout is intentionally simplified for academic report readability.
- Only the major IBOP modules are included.
- The diagram avoids controller-level and API-level implementation details.
- Data flows are shown at a high level to match a Level-1 DFD.
- The diagram is suitable for a single dissertation page.
