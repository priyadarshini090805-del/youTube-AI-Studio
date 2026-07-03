export const KNOWN_BRANDS = [
  "Apple", "Google", "Microsoft", "Amazon", "Tesla", "Meta", "Samsung", "Sony",
  "Netflix", "Nvidia", "Intel", "AMD", "OpenAI", "Anthropic", "IBM", "Oracle",
  "Adobe", "Uber", "Airbnb", "SpaceX", "TikTok", "ByteDance", "Alibaba",
  "Toyota", "Ford", "General Motors", "Boeing", "Airbus", "Walmart", "Nike",
  "Adidas", "Starbucks", "Disney", "Reliance", "Tata", "Infosys", "Wipro",
  "HDFC", "ICICI", "Xiaomi", "Huawei", "Qualcomm", "Spotify", "PayPal",
  "Salesforce", "Zoom", "Slack", "LinkedIn", "Snapchat", "Pinterest",
];

export const BRAND_LOOKUP = new Set(KNOWN_BRANDS.map((brand) => brand.toLowerCase()));
