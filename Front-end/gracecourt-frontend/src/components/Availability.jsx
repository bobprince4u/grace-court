import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";

const BookingCalendar = ({
  onBookingComplete = (bookingData) =>
    console.log("Booking completed:", bookingData),
  onDateSelect = (date) => console.log("Date selected:", date),
  unavailableDates = [], // Array of date strings 'YYYY-MM-DD'
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({});
  const [guests, setGuests] = useState(1);

  // Mock data for demonstration - replace with actual API calls
  const mockAvailabilityData = {
    "2025-08-01": { available: false },
    "2025-08-02": { available: true },
    "2025-08-03": { available: true },
    "2025-08-10": { available: false },
    "2025-08-17": { available: false },
    "2025-08-24": { available: false },
    "2025-08-31": { available: false },
  };

  const fetchAvailability = React.useCallback(async (year, month) => {
    try {
      setIsLoading(true);
      console.log(
        `Fetching availability for year: ${year}, month: ${month + 1}`
      );
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      setAvailabilityData(mockAvailabilityData);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitBooking = async (bookingData) => {
    try {
      setIsLoading(true);
      console.log("Submitting booking:", bookingData);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = { success: true, bookingId: "BK" + Date.now() };

      onBookingComplete(result);
      setSelectedCheckIn(null);
      setSelectedCheckOut(null);
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchAvailability(year, month);
  }, [currentDate, fetchAvailability]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };

  const formatDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  const isDateAvailable = (year, month, day) => {
    const dateStr = formatDate(year, month, day);
    if (unavailableDates.includes(dateStr)) return false;
    const availability = availabilityData[dateStr];
    return availability ? availability.available : true;
  };

  const isDateInPast = (year, month, day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const clickedDate = new Date(year, month, day);

    if (isDateInPast(year, month, day) || !isDateAvailable(year, month, day))
      return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(clickedDate);
      setSelectedCheckOut(null);
      onDateSelect(clickedDate);
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (clickedDate > selectedCheckIn) {
        setSelectedCheckOut(clickedDate);
        onDateSelect(clickedDate);
      } else {
        setSelectedCheckIn(clickedDate);
        setSelectedCheckOut(null);
        onDateSelect(clickedDate);
      }
    }
  };

  const isDateSelected = (day) => {
    if (!day) return false;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);

    return (
      (selectedCheckIn && date.getTime() === selectedCheckIn.getTime()) ||
      (selectedCheckOut && date.getTime() === selectedCheckOut.getTime())
    );
  };

  const isDateInRange = (day) => {
    if (!day || !selectedCheckIn || !selectedCheckOut) return false;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);
    return date > selectedCheckIn && date < selectedCheckOut;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calculateNights = () => {
    if (!selectedCheckIn || !selectedCheckOut) return 0;
    return Math.ceil(
      (selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24)
    );
  };

  const handleBookNow = () => {
    if (selectedCheckIn && selectedCheckOut) {
      const bookingData = {
        checkIn: selectedCheckIn.toISOString().split("T")[0],
        checkOut: selectedCheckOut.toISOString().split("T")[0],
        guests,
        nights: calculateNights(),
      };
      submitBooking(bookingData);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const days = getDaysInMonth(currentDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return (
    <div
      className={`w-full max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div className="p-3 sm:p-4 lg:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">
          Check Availability
        </h2>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Calendar Section */}
          <div className="flex-1 order-2 lg:order-1 min-w-0">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <h3 className="text-base sm:text-lg font-medium">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4 lg:p-6">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {dayNames.map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-xs sm:text-sm font-medium text-gray-600 p-1 sm:p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
                {days.map((day, index) => {
                  const isAvailable = day
                    ? isDateAvailable(currentYear, currentMonth, day)
                    : false;
                  const isPast = day
                    ? isDateInPast(currentYear, currentMonth, day)
                    : false;
                  const isSelected = isDateSelected(day);
                  const isInRange = isDateInRange(day);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(day)}
                      disabled={!day || isPast || !isAvailable || isLoading}
                      className={`
                        h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-xs sm:text-sm rounded transition-all relative flex items-center justify-center
                        ${!day ? "invisible" : ""}
                        ${
                          isPast || !isAvailable
                            ? "text-gray-300 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                        ${
                          isSelected
                            ? "bg-red-500 text-white font-semibold"
                            : ""
                        }
                        ${isInRange ? "bg-red-100" : ""}
                        ${
                          !isSelected && !isInRange && isAvailable && !isPast
                            ? "hover:bg-gray-200 active:bg-gray-300"
                            : ""
                        }
                        ${!isAvailable && !isPast ? "line-through" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 order-1 lg:order-2">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold mb-4 text-base sm:text-lg">
                Booking Summary
              </h4>

              {/* Check-in/Check-out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Check-in
                  </label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded bg-white text-sm">
                    <Calendar
                      size={14}
                      className="sm:w-4 sm:h-4 text-gray-400"
                    />
                    <span className={selectedCheckIn ? "" : "text-gray-400"}>
                      {selectedCheckIn
                        ? selectedCheckIn.toLocaleDateString()
                        : "Select date"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Check-out
                  </label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded bg-white text-sm">
                    <Calendar
                      size={14}
                      className="sm:w-4 sm:h-4 text-gray-400"
                    />
                    <span className={selectedCheckOut ? "" : "text-gray-400"}>
                      {selectedCheckOut
                        ? selectedCheckOut.toLocaleDateString()
                        : "Select date"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nights */}
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nights</span>
                  <span className="text-sm">{calculateNights()}</span>
                </div>
              </div>

              {/* Guests */}
              <div className="mb-4 sm:mb-6">
                <label className="text-xs text-gray-600 mb-1 block">
                  Guests
                </label>
                <div className="flex items-center gap-2 p-2 sm:p-3 border rounded bg-white">
                  <User size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Total (now just shows nights count for clarity) */}
              <div className="border-t pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                  <span>Total Nights</span>
                  <span>{calculateNights()}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedCheckIn || !selectedCheckOut || isLoading}
                className={`
                  w-full py-3 px-4 rounded font-medium transition-colors text-sm sm:text-base
                  ${
                    selectedCheckIn && selectedCheckOut && !isLoading
                      ? "bg-gray-800 hover:bg-gray-900 active:bg-black text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {isLoading ? "Processing..." : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
