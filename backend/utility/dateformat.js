function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-us", { month: "short" }).toLowerCase(); // e.g., 'feb'
  const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day
  const hours = String(date.getHours()).padStart(2, "0"); // Ensures two-digit hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensures two-digit minutes

  return `${year}_${month}-${day}_${hours}:${minutes}`;
}

module.exports = { getFormattedDate };
