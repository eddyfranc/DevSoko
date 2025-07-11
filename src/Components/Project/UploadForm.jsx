import { useState } from "react";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      title,
      description,
      price,
      createdAt: new Date().toISOString(),
    };

    // For now, just log it (we’ll send to Firebase next)
    console.log("Project Submitted: ", newProject);

    // Clear form
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Your Project</h2>

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
