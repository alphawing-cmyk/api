import RoadmapModal from "../components/RoadmapModal";
import Alpaca from "~/images/platforms/alpaca.svg";
import Kraken from "~/images/platforms/krakken.svg";
import Oanda from "~/images/platforms/oanda.svg";

const Tech = () => {
  return (
    <>
      <div className="mx-auto max-w-[1240px] grid md:grid-cols-2 mt-32">
        <div className="flex flex-col justify-center animate__animated animate__fadeIn">
          <p className="text-green-500 text-xl font-bold">
            We currently are integrated with the following platforms and there
            is more to come.
          </p>
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            What does this mean?
          </h1>
          <p className="text-slate-500">
            Our platform integrates with Alpaca and Tradestation allowing you to
            control / execute your trades and the rest of the process is handled
            by via APIs. We are continously developing and enhancing our
            platform. We will be working on integrating with other platforms as
            well in the future roadmap.
          </p>

          <RoadmapModal />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-center items-center">
            <img src="./platforms/alpaca.svg" className="w-[150px] h-[150px] mx-auto my-4" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img src="./platforms/krakken.svg" className="w-[150px] h-[150px] mx-auto my-4" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img src="./platforms/oanda.svg" className="w-[150px] h-[150px] mx-auto my-4" />
          </div>
        </div>
      </div>
      {/* <Roadmap :show="showRoadmap" @close="handleRoadmap" /> */}
    </>
  );
};

export default Tech;
