import { TimeRange } from "./lib/actions";

export const TimeRangeToggle = ({
  selectedTimeRange,
  setTimeRange,
}: {
  selectedTimeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}) => {
  const timeRanges: TimeRange[] = ["short_term", "medium_term", "long_term"];
  return (
    <div className="flex justify-center space-x-1 border w-fit rounded-lg px-2 py-1 text-sm">
      {timeRanges.map((timeRange) => (
        <button
          key={timeRange}
          onClick={() => setTimeRange(timeRange)}
          className={`${selectedTimeRange === timeRange ? "underline" : ""}`}
        >
          {timeRange.split("_")[0]}
        </button>
      ))}
    </div>
  );
};
