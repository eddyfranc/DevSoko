import { useState } from "react";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !description || !price || !imageFile) {
      setMessage("⚠️ Fill in all fields and select an image.");
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      const newProject = {
        id: Date.now(),
        title,
        description,
        price,
        imageUrl: base64Image,
      };

      const existing = JSON.parse(localStorage.getItem("myProjects")) || [];
      localStorage.setItem("myProjects", JSON.stringify([...existing, newProject]));

      setMessage("✅ Project saved locally!");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
    };

    reader.readAsDataURL(imageFile);
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload Project
      </button>
    </form>
  );
};

export default UploadForm;
