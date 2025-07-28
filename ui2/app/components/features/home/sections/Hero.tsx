import Typewriter from "typewriter-effect";

const Hero = () => {
  return (
    <section
      id="home"
      className="bg-tmLightBlack text-white h-screen w-full flex items-center justify-center"
    >
      <div className="max-w-3xl text-center px-4 animate-fade-in">
        <h1 className="text-tmGolden text-sm sm:text-base font-semibold uppercase tracking-widest mb-4">
          Let's automate the markets
        </h1>

        <h2 className="text-3xl sm:text-5xl font-bold mb-2">
          Control your trades
        </h2>
        <h2 className="text-3xl sm:text-5xl font-bold mb-6">
          with a click of a button
        </h2>

        <div className="text-xl sm:text-3xl font-bold text-blue-400 h-[50px] sm:h-[60px] flex items-center justify-center">
          <Typewriter
            options={{
              strings: ["Alpaca", "Oanda", "Kraken"],
              autoStart: true,
              loop: true,
              wrapperClassName: "inline-block",
              cursorClassName: "text-blue-400",
            }}
          />
        </div>

        <p className="text-[#d6d6d6] text-base sm:text-xl mt-6 mb-8 px-2 sm:px-0">
          Featuring state-of-the-art trading algorithms designed to optimize
          your profits across various markets.
        </p>

        <button className="bg-tmGolden text-black font-medium px-8 py-3 rounded-md hover:scale-105 transition-transform duration-200">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
