export const KNOWN_LOCATIONS = [
  "India", "Australia", "England", "Pakistan", "New Zealand", "South Africa",
  "Sri Lanka", "Bangladesh", "West Indies", "Afghanistan", "Zimbabwe", "Ireland",
  "Scotland", "Netherlands", "United States", "United Kingdom", "China", "Japan",
  "Russia", "France", "Germany", "Italy", "Spain", "Canada", "Brazil", "Mexico",
  "Nigeria", "Kenya", "Egypt", "Israel", "Iran", "Iraq", "Ukraine", "Poland",
  "Nepal", "Bhutan", "Myanmar", "Singapore", "Malaysia", "Indonesia", "Thailand",
  "Mumbai", "Delhi", "New Delhi", "Bengaluru", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
  "Guwahati", "Dharamshala", "Nagpur", "Indore", "Bhopal", "Patna", "Ranchi",
  "London", "Manchester", "Birmingham", "Leeds", "Sydney", "Melbourne",
  "Brisbane", "Perth", "Adelaide", "Canberra", "Wellington", "Auckland",
  "Christchurch", "Karachi", "Lahore", "Islamabad", "Colombo", "Dhaka",
  "Washington", "New York", "Los Angeles", "Chicago", "Beijing", "Shanghai",
  "Tokyo", "Moscow", "Paris", "Berlin", "Rome", "Madrid", "Dubai", "Doha",
  "Riyadh", "Kathmandu", "Geneva", "Brussels", "Ottawa", "Toronto",
  "Johannesburg", "Cape Town", "Durban", "Harare", "Lagos", "Nairobi",
  "Parliament", "Lok Sabha", "Rajya Sabha", "White House", "Downing Street",
  "Kremlin", "United Nations", "Wall Street", "Silicon Valley",
];

export const LOCATION_LOOKUP = new Set(
  KNOWN_LOCATIONS.map((location) => location.toLowerCase()),
);
