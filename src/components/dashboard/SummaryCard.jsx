const SummaryCard = ({
    title,
    value,
    bg = "bg-primary"
}) => {

    /*
    |--------------------------------------------------------------------------
    | SAFE VALUE
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
         * If value is already a number
         */
        if (typeof input === "number") {

            return Number.isFinite(input)
                ? input
                : 0;

        }

        /*
         * Convert string safely
         *
         * Supports:
         *
         * "58141.55"
         * "58,141.55"
         * "₹58,141.55"
         * "-₹54,560.78"
         */

        if (typeof input === "string") {

            const cleaned =
                input
                    .replace(/₹/g, "")
                    .replace(/,/g, "")
                    .replace(/\s/g, "")
                    .trim();


            const negative =
                cleaned.startsWith("-");


            const numericString =
                cleaned.replace(
                    /[^0-9.]/g,
                    ""
                );


            const number =
                Number(
                    numericString
                );


            if (
                !Number.isFinite(number)
            ) {

                return 0;

            }


            return negative
                ? -number
                : number;

        }


        /*
         * Anything else
         */

        const number =
            Number(input);


        return Number.isFinite(number)
            ? number
            : 0;

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT
    |--------------------------------------------------------------------------
    */

    const numericValue =
        getNumericValue(
            value
        );


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

                <div
                    className="
                        small
                        opacity-75
                        mb-2
                    "
                >

                    {title}

                </div>


                <div
                    className="
                        fw-bold
                        fs-5
                    "
                >

                    ₹{formattedValue}

                </div>

            </div>

        </div>

    );

};


export default SummaryCard;