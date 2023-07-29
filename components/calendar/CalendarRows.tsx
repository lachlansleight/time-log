import TextUtils from "lib/TextUtils";

const CalendarRows = ({ showLines = false }: { showLines?: boolean }): JSX.Element => {
    return (
        <>
            {showLines && (
                <div className="absolute left-0 top-0 w-full h-full">
                    {Array.from({ length: 25 }).map((_, i) => {
                        return (
                            <div
                                key={i}
                                className={`absolute border-t border-white border-opacity-10`}
                                style={{
                                    top: `calc(${(i * 100) / 25}% + 0.75rem)`,
                                    width: `calc(100% - 4rem)`,
                                    left: "2rem",
                                }}
                            />
                        );
                    })}
                </div>
            )}
            <div className="relative left-0 top-0 h-full w-8">
                {Array.from({ length: 25 }).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="absolute grid place-items-center w-8"
                            style={{
                                top: `calc(${(i * 100) / 25}% - 0.9rem)`,
                                height: `calc(100% / 24)`,
                            }}
                        >
                            <span className="text-[0.67rem] text-white text-opacity-50">
                                {TextUtils.getHourString(i, false)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarRows;
