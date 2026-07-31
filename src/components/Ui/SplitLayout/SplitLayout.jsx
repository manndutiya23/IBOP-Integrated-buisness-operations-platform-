import "./SplitLayout.css";

function SplitLayout({
    left,
    right,
    leftWidth = "2fr",
    rightWidth = "1fr",
    reverse = false,
    gap = "32px",
}) {

    return (

        <div
            className={`ibop-split-layout ${
                reverse ? "ibop-split-layout--reverse" : ""
            }`}
            style={{
                "--left-width": leftWidth,
                "--right-width": rightWidth,
                "--split-gap": gap,
            }}
        >

            <div className="ibop-split-layout__left">

                {left}

            </div>

            <div className="ibop-split-layout__right">

                {right}

            </div>

        </div>

    );

}

export default SplitLayout;