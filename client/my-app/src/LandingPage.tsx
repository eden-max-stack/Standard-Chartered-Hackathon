import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-inter">
      {/* ✅ Hero Section */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center text-white text-center">
  {/* Background Image */}
  <div
    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('https://i.pinimg.com/736x/72/59/b8/7259b8a62a6e596a170f0aa257e03b20.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(5px)", // Slight blur for better readability
    }}
  ></div>

  {/* Blue Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#002147]/80 via-[#003366]/60 to-[#002147]/80"></div>

  {/* Content */}
  <h1 className="text-8xl font-bold drop-shadow-lg relative">SkyNet Bank Corp.</h1>
  <p className="text-xl mt-4 text-white max-w-2xl drop-shadow-md relative">
    Protecting your finances, securing your family's future.
  </p>

  {/* Buttons */}
  <div className="mt-6 flex space-x-4 relative">
    {/* Learn More Button */}
    <button
      onClick={() => navigate("/learn-more")}
      className="bg-white text-[#003366] px-6 py-3 rounded-lg text-lg hover:bg-[#003366] hover:text-white transition-all"
    >
      Learn More
    </button>

    {/* Become a Member Button */}
    <button
      onClick={() => navigate("/become-a-member")}
      className="bg-[#FF9933] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#003366]  transition-all"
    >
      Become a Member
    </button>
  </div>
</div>


      {/* ✅ Virtual AI Branch Manager Section */}
      <div className="flex flex-col md:flex-row items-center justify-center px-10 gap-10 pt-20">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#002147]">Virtual AI Branch Manager</h2>
          <p className="text-gray-600 mt-4">
            Get instant assistance with our AI-powered branch manager. Ask any banking-related
            queries and get real-time responses!
          </p>
          <button
            onClick={() => navigate("/ai-branch-manager")}
            className="mt-6 bg-[#002147] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#FF9933] transition-all"
          >
            Try It Now
          </button>
        </div>
        <img
          src="https://www.netcetera.com/dam/jcr:673cce67-265c-4cf3-8ce6-d826807beb40/supperappsarticletile1.webp"
          alt="AI Branch Manager"
          className="md:w-1/2 shadow-lg"
        />
      </div>

      {/* ✅ Loan Eligibility Section */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-center py-20 px-10 gap-10">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#002147]">Loan Eligibility</h2>
          <p className="text-gray-600 mt-4">
            Check your loan eligibility instantly and explore customized options that suit your
            financial needs.
          </p>
          <button
            onClick={() => navigate("/loan-eligibility")}
            className="mt-6 bg-[#002147] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#FF9933] transition-all"
          >
            Check Eligibility
          </button>
        </div>
        <img
          src="https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/personal-banking/loans/bank-of-baroda-loans-spotlightbanner.jpg?h=400&iar=0&w=1080&hash=922F956F3BC4FBCE17E25B592D370919"
          alt="Loan Eligibility"
          className="md:w-1/2 shadow-lg"
        />
      </div>

      {/* ✅ FAQ / Contact Us Section */}
      <div className="py-20 px-10 text-center bg-[#002147] text-white">
        <h2 className="text-3xl font-bold">Have Questions? We’re Here to Help!</h2>
        <p className="mt-4 text-gray-300">Explore our FAQs or reach out to us for assistance.</p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/contact-us")}
            className="bg-white text-[#002147] px-6 py-3 rounded-lg text-lg hover:bg-gray-200 transition-all"
          >
            Contact Us
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="bg-white text-[#002147] px-6 py-3 rounded-lg text-lg hover:bg-gray-200 transition-all"
          >
            Read FAQs
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
