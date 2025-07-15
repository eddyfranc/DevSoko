// src/Components/Project/UploadForm.jsx
import { useState } from "react";
import { db, auth, storage } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!title || !description || !price || !imageFile) {
      setMessage("⚠️ Fill in all fields and select an image.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `projectImages/${auth.currentUser.uid}/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Step 2: Save project info in Firestore
      await addDoc(collection(db, "userProjects"), {
        title,
        description,
        price: parseFloat(price),
        userId: auth.currentUser.uid,
        imageUrl,
        createdAt: Timestamp.now(),
      });

      setMessage("✅ Project uploaded successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
    } catch (error) {
      console.error("Upload failed:", error.message);
      setMessage("❌ Failed to upload project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4"
    >
      <h2 className="text-xl font-bold">Upload Project</h2>
      {message && <p className="text-sm text-blue-600">{message}</p>}

      <input
        type="text"
        placeholder="Project Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full border p-2 rounded"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price (KES)"
        className="w-full border p-2 rounded"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        className="w-full border p-2 rounded"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Submit Project"}
      </button>
    </form>
  );
};

export default UploadForm;
