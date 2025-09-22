// Test if a Cloudinary image URL is accessible
const testUrl =
  "https://res.cloudinary.com/dqubxsdcu/image/upload/v1758537361/socialhop/users/user_32V19bc07s2C3LlFKlC1lKgQQBV/pzpkqssrnjlgttczvkj3.jpg";

console.log("Testing Cloudinary image URL:", testUrl);

fetch(testUrl)
  .then((response) => {
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      console.log("✅ Image URL is accessible");
    } else {
      console.log(
        "❌ Image URL returned error:",
        response.status,
        response.statusText
      );
    }
  })
  .catch((error) => {
    console.error("❌ Error fetching image:", error.message);
  });
