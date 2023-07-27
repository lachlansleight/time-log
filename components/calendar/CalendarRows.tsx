const CalendarRows = (): JSX.Element => {
    return (
        <>
            <div className="absolute left-0 top-0 w-full h-full">
                {Array.from({ length: 25 }).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className={`absolute border-t border-white border-opacity-10`}
                            style={{
                                top: `calc(${(i * 100) / 25}% + 0.75rem)`,
                                width: `calc(100% - 2rem)`,
                                left: "2rem",
                            }}
                        />
                    );
                })}
            </div>
            <div className="relative left-0 top-0 h-full w-8">
                {Array.from({ length: 25 }).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="absolute grid place-items-center w-8"
                            style={{
                                top: `calc(${(i * 100) / 25}% - 0.5rem)`,
                                height: `calc(100% / 24)`,
                            }}
                        >
                            <span>{i % 12 === 0 ? "12" : i % 12}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarRows;
