import cloudinary
import os
from dotenv import load_dotenv

# 🔥 load env file
load_dotenv()

# 🔥 config
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

print("✅ Cloudinary configured successfully")