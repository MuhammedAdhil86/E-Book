import React from 'react';

export default function NewsletterSubscribe() {
  return (
    <div className="flex flex-col md:flex-row items-stretch w-full min-h-[24rem] font-serif">
      {/* Left: Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-auto relative">
        <img
          src="https://images-pw.pixieset.com/elementfield/31054714/Namratapranay_SP_TBB-130-92312ff4.jpg"
          alt="Wedding Group"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Newsletter Form Section */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 py-10 sm:py-12 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl leading-snug tracking-normal font-normal mb-4">
          Subscribe to my<br className="hidden md:block" /> Newsletter
        </h1>

        <p className="text-gray-700 mb-6 max-w-md mx-auto md:mx-0 text-sm sm:text-base">
          Sign up to receive Sonali’s 3R’s newsletters. No spam, just a Recipe,
          a Recommendation, and a Really bad joke!<br />
          Also, get a free recipe book for signing up.
        </p>

        <form className="flex flex-col sm:flex-row items-center max-w-md mx-auto md:mx-0 gap-2 sm:gap-0">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full sm:flex-grow border border-gray-300 rounded sm:rounded-l px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-700 px-6 py-2 rounded sm:rounded-r"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
