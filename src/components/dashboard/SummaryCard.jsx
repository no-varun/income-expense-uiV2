const SummaryCard = ({
    title,
    value = 0,
    bg = "bg-primary",
    prefix = "₹",
    suffix = ""
}) => {

    /*
    |--------------------------------------------------------------------------
    | SAFE NUMBER
    |--------------------------------------------------------------------------
    */

    const getNumericValue = (input) => {

        if (
            input === null ||
            input === undefined ||
            input === ""
        ) {
            return 0;
        }


        /*
        |--------------------------------------------------------------------------
        | NUMBER
        |--------------------------------------------------------------------------
        */

        if (typeof input === "number") {

            return Number.isFinite(input)
                ? input
                : 0;

        }


        /*
        |--------------------------------------------------------------------------
        | STRING
        |--------------------------------------------------------------------------
        */

        if (typeof input === "string") {

            const cleaned =
                input
                    .replace(/₹/g, "")
                    .replace(/,/g, "")
                    .replace(/\s/g, "")
                    .trim();


            if (!cleaned) {
                return 0;
            }


            const number =
                Number(cleaned);


            return Number.isFinite(number)
                ? number
                : 0;

        }


        /*
        |--------------------------------------------------------------------------
        | OTHER
        |--------------------------------------------------------------------------
        */

        const number =
            Number(input);


        return Number.isFinite(number)
            ? number
            : 0;

    };


    /*
    |--------------------------------------------------------------------------
    | NUMERIC VALUE
    |--------------------------------------------------------------------------
    */

    const numericValue =
        getNumericValue(
            value
        );


    /*
    |--------------------------------------------------------------------------
    | FORMATTED VALUE
    |--------------------------------------------------------------------------
    */

    const formattedValue =
        numericValue.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="col-12 col-sm-6 col-lg-3">

            <div
                className={`
                    ${bg}
                    text-white
                    rounded
                    shadow-sm
                    h-100
                    p-3
                `}
            >

                {/* TITLE */}

                <div
                    className="
                        small
                        opacity-75
                        mb-2
                    "
                >

                    {title}

                </div>


                {/* VALUE */}

                <div
                    className="
                        fw-bold
                        fs-5
                    "
                >

                    {prefix}

                    {formattedValue}

                    {suffix}

                </div>

            </div>

        </div>

    );

};


export default SummaryCard;