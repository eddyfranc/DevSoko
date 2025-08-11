import React, { useState } from 'react';
import NotEnoughConnectsModal from './NotEnoughConnectsModal';

const SubmitWorkForm = ({ connects, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const submissionCost = 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (connects < submissionCost) {
      setShowWarning(true);
    } else {
      onSubmit(title, submissionCost);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Submit Your Work</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="border w-full p-2 rounded mb-4"
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          Submit (Costs {submissionCost} Connects)
        </button>
      </form>

      {showWarning && <NotEnoughConnectsModal />}
    </div>
  );
};

export default SubmitWorkForm;
