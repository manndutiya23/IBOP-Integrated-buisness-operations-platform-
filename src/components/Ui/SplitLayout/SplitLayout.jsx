import "./SplitLayout.css";

function SplitLayout({

    left,

    right,

    children,

    leftWidth = "2fr",

    rightWidth = "1fr",

    reverse = false,

    gap = "32px",

}) {

    let resolvedLeft = left;
    let resolvedRight = right;

    if (children) {

        const childArray =
            Array.isArray(children)
                ? children
                : [children];

        resolvedLeft = childArray[0];
        resolvedRight = childArray[1];

    }

    return (

        <div

            className={`ibop-split-layout ${
                reverse
                    ? "ibop-split-layout--reverse"
                    : ""
            }`}

            style={{

                "--left-width": leftWidth,

                "--right-width": rightWidth,

                "--split-gap": gap,

            }}

        >

            <div className="ibop-split-layout__left">

                {resolvedLeft}

            </div>

            <div className="ibop-split-layout__right">

                {resolvedRight}

            </div>

        </div>

    );

}

export default SplitLayout;