import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  max = 5,
  rating = 0,
  onRate,
  clickable = true,
  size = 20,
  showTooltip = false,
  className = "",
}) {
  const [hover, setHover] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = (value) => {
    if (!clickable) return;
    setCurrentRating(value);
    if (onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!clickable) return;
    setHover(value);
    if (showTooltip) {
      setTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setHover(0);
    setTooltipVisible(false);
  };

  return (
    <div className={`flex items-center relative ${className}`}>
      {[...Array(max)].map((_, i) => {
        const value = i + 1;
        const isFilled = value <= (hover || currentRating);

        return (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
          >
            <Star
              className={`cursor-${
                clickable ? "pointer" : "default"
              } transition-colors duration-150 ${
                isFilled
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              style={{ width: size, height: size }}
              onClick={() => handleClick(value)}
              fill={isFilled ? "currentColor" : "none"}
            />
            {showTooltip && tooltipVisible && hover === value && (
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Rate {value} star{value !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        );
      })}

      {clickable && currentRating > 0 && (
        <button
          className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={() => handleClick(0)}
          aria-label="Clear rating"
        >
          Clear
        </button>
      )}
    </div>
  );
}
