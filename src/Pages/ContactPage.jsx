import {FaFacebookF,FaTwitter, FaInstagram,  FaLinkedinIn,  FaWhatsapp,} from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12  pt-36 px-4 md:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-red-100">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full name *
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work email address *
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                How can we help you? *
              </label>
              <textarea
                placeholder="Message"
                rows="4"
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              CONTACT US
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <h4 className="text-blue-800 font-semibold uppercase tracking-wide">
              Contact Us
            </h4>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              Let's Get In Touch
            </h2>
            <p className="mt-4 text-gray-600">
              Are you struggling with your project? Our experienced team can
              help! We offer professional guidance and support to ensure your
              project is a success. Contact us now to get started.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-gray-800">
              Follow Us On Social Media
            </h4>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com/YourPageName"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 p-3 rounded-full text-white hover:bg-blue-600 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/YourHandle"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 p-3 rounded-full text-white hover:bg-blue-600 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/YourHandle"
                rel="noopener noreferrer"
                className="bg-blue-800 p-3 rounded-full text-white hover:bg-blue-600 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/YourHandle"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 p-3 rounded-full text-white hover:bg-blue-600 transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* WhatsApp Chat */}
          <div className="fixed bottom-6 right-6 flex items-center space-x-2">
            <span className="bg-gray-100 px-3 py-2 rounded-lg shadow text-sm font-semibold">
              NEED HELP? <span className="text-gray-700">CHAT WITH US</span>
            </span>
            <a
              href="https://wa.me/wa.no"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 p-4 rounded-full text-white shadow-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>
      </div>
      {/* <h1 className="text-center"> Partners and customers</h1> */}
      {/* <div>Zindua</div> */}

    </div>
  );
};

export default ContactPage;
