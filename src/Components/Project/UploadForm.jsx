import { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to upload a project.");
        return;
      }

      await addDoc(collection(db, "projects"), {
        title,
        description,
        price,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      // Clear form + redirect
      setTitle("");
      setDescription("");
      setPrice("");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to upload project: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Your Project</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Project Title"
        className="w-full p-2 mb-4 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 mb-4 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Price (KES)"
        className="w-full p-2 mb-4 border rounded"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Upload Project
      </button>
    </form>
  );
};

export default UploadForm;
