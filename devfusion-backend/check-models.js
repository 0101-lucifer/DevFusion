require("dotenv").config();

async function checkModels() {
  try {
    console.log("Fetching available models from Google...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    
    const data = await response.json();
    
    if (data.models) {
      console.log("\n✅ SUCCESS! Here are the exact model names your key can use:");
      data.models.forEach(model => {
        // Only log models that support content generation
        if (model.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${model.name.replace('models/', '')}`);
        }
      });
    } else {
      console.log("\n❌ Error or no models found:", data);
    }
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

checkModels();