// src/Components/Project/UploadForm.jsx
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      return alert("Please fill in all fields.");
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "userProjects"), {
        title,
        description,
        price: parseFloat(price),
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });

      setMessage("✅ Project uploaded successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload. Try again.");
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

      {message && <p className="text-sm">{message}</p>}

      <input
        type="text"
        placeholder="Project Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Project Description"
        className="w-full border p-2 rounded"
        rows={4}
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
