import { Link } from "react-router-dom";
import { Button, Input, Select } from "../Ui";
import "./FinanceToolbar.css";

function FinanceToolbar({

    searchTerm,

    setSearchTerm,

    category,

    setCategory,

    options = [],

    searchPlaceholder = "Search...",

    addButtonText = "+ Add Expense",

    addButtonLink = "/finance",
    showButton = true,

})  {

    return (

        <div className="finance-toolbar">

            <div className="finance-toolbar__left">

                <Input
                    value={searchTerm}
                    placeholder={searchPlaceholder}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                />

  <Select

    value={category}

    onChange={(event) =>
        setCategory(event.target.value)
    }

>

    {options.map(option => (

        <option
            key={option}
            value={option}
        >

            {option}

        </option>

    ))}

</Select>
            </div>

            {showButton && (

<div className="finance-toolbar__right">

    <Link to={addButtonLink}>

        <Button>

            {addButtonText}

        </Button>

    </Link>

</div>

)}
        </div>

    );

}

export default FinanceToolbar;