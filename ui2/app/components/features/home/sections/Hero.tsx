import Typewriter from "typewriter-effect";

const Hero = () => {
  return (
    <div className="text-white bg-tmLightBlack h-screen w-full" id="home">
      <div
        className="max-w-[800px] w-full h-full mx-auto text-center
                 flex flex-col justify-center items-center"
      >
        <p className="text-tmGolden font-bold p-2 uppercase">
          let's automate the markets
        </p>
        <div className="flex justify-center items-center">
          <p className="md:text-5xl sm:text-4xl text-xl font-bold py-4">
            Control your trades with a click of a button
            <br />
            <Typewriter
              component={"span"}
              options={{
                strings: ["Alpaca", "Oanda", "Kraken"],
                autoStart: true,
                loop: true,
                wrapperClassName:
                  "md:text-5xl sm:text-4xl text-xl font-bold pl-2 md:pl-4 text-blue-400",
              }}
            />
          </p>
        </div>
        <p className="md:text-2xl text-xl font-bold text-[#d6d6d6] px-4">
          Featuring state of the art trading algorithms designed to optmize your
          profits across various markets
        </p>
        <button className="bg-tmGolden w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 text-black">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
