# IBOP UML Use Case Diagram

This use case diagram is based strictly on the implemented IBOP project for Shrinath Enterprises. The actor labeled Inventory Manager corresponds to the implemented Supply Chain role in the repository.

## Mermaid Source Sketch

```mermaid
flowchart LR
    Admin[Admin]
    HR[HR Employee]
    INV[Inventory Manager]
    Sales[Sales Employee]
    Fin[Finance Employee]
    Mgmt[Management]

    subgraph SYS[IBOP System]
        direction TB
        Login((Login))
        Dash((View Dashboard))
        ManageInv((Manage Inventory))
        AddProd((Add Products))
        UpdateStock((Update Stock))
        Monitor((Monitor Product Availability))
        ManageEmp((Manage Employees))
        CreateSale((Create Sale))
        GenInv((Generate Invoice))
        Purch((Record Purchases))
        TrackExp((Track Expenses))
        FinAna((View Financial Analytics))
    end

    Admin --> Login
    Admin --> Dash
    Admin --> ManageInv
    Admin --> CreateSale
    Admin --> Purch
    Admin --> TrackExp
    Admin --> ManageEmp
    Admin --> FinAna
    Admin --> GenInv

    HR --> Login
    HR --> ManageEmp
    HR --> Dash

    INV --> Login
    INV --> ManageInv
    INV --> AddProd
    INV --> UpdateStock
    INV --> Monitor
    INV --> Purch

    Sales --> Login
    Sales --> CreateSale
    Sales --> GenInv
    Sales --> Dash

    Fin --> Login
    Fin --> TrackExp
    Fin --> FinAna
    Fin --> Dash

    Mgmt --> Login
    Mgmt --> Dash
    Mgmt --> FinAna

    ManageInv --> AddProd
    ManageInv --> UpdateStock
    ManageInv --> Monitor
```

## Notes

- Actors are arranged in a balanced way to reduce line crossing and avoid visual isolation.
- The diagram includes only workflows visible in the current repository.
- No controller-level or API-level details are shown.
- Inventory Manager is used as the academic label for the implemented Supply Chain responsibilities.
