// Utility: Get the Nth occurrence of a weekday in a month
const getNthWeekdayOfMonth = (year, month, weekday, n) => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (7 + weekday - firstDay.getDay()) % 7;
  const day = 1 + firstWeekday + (n - 1) * 7;
  return new Date(year, month, day);
};

// Utility: Get the last occurrence of a weekday in a month
const getLastWeekdayOfMonth = (year, month, weekday) => {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = (7 + lastDay.getDay() - weekday) % 7;
  const day = lastDay.getDate() - lastWeekday;
  return new Date(year, month, day);
};

// Utility: Adjust for weekend (Saturday => Friday, Sunday => Monday)
const adjustForWeekend = (date) => {
  const day = date.getDay();
  if (day === 0) date.setDate(date.getDate() + 1); // Sunday
  else if (day === 6) date.setDate(date.getDate() - 1); // Saturday
  return date;
};

// Main holiday generator
const generateHolidays = () => {
  const year = new Date().getFullYear();

  const rawHolidays = [
    {
      date: new Date(`${year}-01-01`),
      name: "New Year's Day",
      reason: 'Celebrates the beginning of the year'
    },
    {
      date: getNthWeekdayOfMonth(year, 0, 1, 3), // Jan: 3rd Monday
      name: 'Martin Luther King Jr. Day',
      reason: 'Honors the civil rights leader Martin Luther King Jr.'
    },
    {
      date: new Date(`${year}-01-26`),
      name: 'Republic Day',
      reason: 'Celebrates the adoption of the Constitution of India'
    },
    {
      date: getNthWeekdayOfMonth(year, 1, 1, 3), // Feb: 3rd Monday
      name: "Presidents' Day",
      reason: 'Honors all U.S. presidents, especially George Washington and Abraham Lincoln'
    },
    {
      date: getNthWeekdayOfMonth(year, 2, 0, 2), // March: 2nd Sunday
      name: 'Holi',
      reason: 'Festival of colors celebrating the arrival of spring'
    },
    {
      date: new Date(`${year}-04-14`),
      name: 'Ambedkar Jayanti',
      reason: 'Honors Dr. B.R. Ambedkar, the architect of the Indian Constitution'
    },
    {
      date: getLastWeekdayOfMonth(year, 4, 1), // May: last Monday
      name: 'Memorial Day',
      reason: 'Honors military personnel who died in service'
    },
    {
      date: new Date(`${year}-06-19`),
      name: 'Juneteenth National Independence Day',
      reason: 'Commemorates the emancipation of enslaved African Americans'
    },
    {
      date: new Date(`${year}-07-04`),
      name: 'Independence Day',
      reason: 'Celebrates the adoption of the Declaration of Independence'
    },
    {
      date: new Date(`${year}-08-15`),
      name: 'Independence Day (India)',
      reason: 'Marks India\'s independence from British rule'
    },
    {
      date: getNthWeekdayOfMonth(year, 8, 1, 1), // Sept: 1st Monday
      name: 'Labor Day',
      reason: 'Honors American workers and the labor movement'
    },
    {
      date: getNthWeekdayOfMonth(year, 9, 1, 2), // Oct: 2nd Monday
      name: 'Columbus Day',
      reason: 'Commemorates Christopher Columbus\' landing in the Americas'
    },
    {
      date: new Date(`${year}-10-02`),
      name: 'Gandhi Jayanti',
      reason: 'Honors Mahatma Gandhi, the Father of the Nation'
    },
    {
      date: new Date(`${year}-11-04`), // Example date for Diwali (adjust yearly)
      name: 'Diwali',
      reason: 'Festival of lights symbolizing the victory of light over darkness'
    },
    {
      date: getNthWeekdayOfMonth(year, 10, 4, 4), // Nov: 4th Thursday
      name: 'Thanksgiving Day',
      reason: 'Gives thanks for the harvest and blessings of the year'
    },
    {
      date: new Date(`${year}-11-11`),
      name: 'Veterans Day',
      reason: 'Honors military veterans who served in the U.S. Armed Forces'
    },
    {
      date: new Date(`${year}-12-25`),
      name: 'Christmas Day',
      reason: 'Celebrates the birth of Jesus Christ'
    }
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return rawHolidays.map(holiday => {
    const adjustedDate = adjustForWeekend(new Date(holiday.date));
    return {
      name: holiday.name,
      reason: holiday.reason,
      date: adjustedDate.toISOString().split('T')[0],
      month: adjustedDate.getMonth() + 1, // 1-based month
    };
  });
};

// Filter holidays that occur in the current month
const getCurrentMonthHolidays = () => {
  const holidays = generateHolidays();
  const currentMonth = new Date().getMonth() + 1;

  const currentMonthHolidays = holidays.filter(h => h.month === currentMonth);

  return {
    total: currentMonthHolidays.length,
    holidays: currentMonthHolidays.map(h => ({
      name: h.name,
      date: h.date,
      reason: h.reason
    })),
  };
};

export { generateHolidays, getCurrentMonthHolidays };
