import { TimeRange } from "./lib/actions";

export const TimeRangeToggle = ({
  selectedTimeRange,
  setTimeRange,
}: {
  selectedTimeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}) => {
  const timeRanges: TimeRange[] = ["short_term", "medium_term", "long_term"];
  const label: Record<TimeRange, string> = {
    short_term: "Short",
    medium_term: "Medium",
    long_term: "Long",
  };
  return (
    <div className="flex justify-center w-fit text-sm">
      {timeRanges.map((timeRange) => {
        const isFirst = timeRange === timeRanges[0];
        const isLast = timeRange === timeRanges[timeRanges.length - 1];
        return (
          <button
            key={timeRange}
            onClick={() => setTimeRange(timeRange)}
            className={`${
              selectedTimeRange === timeRange ? "bg-slate-400 text-white" : ""
            } ${isLast ? "rounded-r-lg" : "border-r"} ${
              isFirst ? "rounded-l-lg" : ""
            } px-2 py-1 border`}
          >
            {label[timeRange]}
          </button>
        );
      })}
    </div>
  );
};
