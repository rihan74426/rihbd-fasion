import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function seedDefaultAdmin() {
  try {
    await connectDB();

    const adminExists = await Admin.findOne({ username: "admin" });

    if (!adminExists) {
      const newAdmin = new Admin({
        username: "admin",
        password: "admin123", // Will be hashed by the pre-save hook
      });

      await newAdmin.save();
      console.log("✓ Default admin created: username=admin, password=admin123");
      return { created: true };
    } else {
      console.log("✓ Admin account already exists");
      return { created: false };
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
}
