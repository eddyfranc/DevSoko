import { Link } from 'react-router-dom';

const NewProjectsAvailable = () => {
  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40">
      <Link
        to="/projects"
        className="
          bg-blue-600
          text-white
          text-sm
          px-4
          py-2
          rounded-full
          shadow-lg
          flex
          items-center
          space-x-2
          animate-blink
          hover:bg-blue-700
          transition-colors
          duration-300
        "
      >
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <span>New Projects Available</span>
      </Link>
    </div>
  );
};

export default NewProjectsAvailable;