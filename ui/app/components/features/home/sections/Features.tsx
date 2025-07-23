import Laptop from "~/images/home/laptop.jpg";
import FeatureModal from "../components/FeatureModal";
import FeatureDescriptions from "../data/FeatureDescriptions";
import { Waypoints, ChartNoAxesCombined, RefreshCw, Shield, MessageSquare, Code  } from "lucide-react";

const Features = () => {
  return (
    <div className="w-full bg-white py-16 px-4" id="features">
      <div className="mx-auto max-w-[1240px] grid md:grid-cols-2">
        <img src={Laptop} alt="/" className="w-[500px] mx-auto my-4" />
        <div className="flex flex-col justify-center animate__animated animate__fadeIn">
          <p className="text-green-500 text-xl font-bold">
            Alpha Wing Trading Platform
          </p>
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Manage everything in one platform
          </h1>
          <p className="text-slate-500">
            Built using a powerful Python backend, price data is automatically
            updated in real time. Strategies are continously run across many
            markets such as stocks, crypto, and currency, and signals are then
            generated. Users have the ability to have our system automatically
            trade your account or trade manually.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-x-10 gap-y-[75px] w-full relative mt-32 max-w-[1240px] mx-auto">
        {/*------------ Feature Start -----------------*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
            <ChartNoAxesCombined  size="4em" className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]"  />
          <div className="p-8">
            <h3 className="font-bold text-2xl my-6">Metrics</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[200px]">
              {FeatureDescriptions.overviews.metrics}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Metrics"
                modalDescription={FeatureDescriptions.additional.metricFeature()}
              />
            </div>
          </div>
        </div>
        {/*------------ Feature End -----------------*/}

        {/*------------ Feature Start -----------------*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
          <Waypoints className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]" size="4em"  />
          <div className="p-8">
            <h3 className="font-bold text-2xl my-6">Strategies</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[200px]">
              {FeatureDescriptions.overviews.algos}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Strategies"
                modalDescription={FeatureDescriptions.additional.algoFeatures()}
              />
            </div>
          </div>
        </div>
        {/*------------ Feature End -----------------*/}

        {/*<!---------- Feature Start ----------------->*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
          <RefreshCw size="4em"  className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]" />

          <div className="p-8">
            <h3 className="font-bold text-2xl my-6">Platform Support</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[200px]">
              {FeatureDescriptions.overviews.platform}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Platform Support"
                modalDescription={FeatureDescriptions.additional.platformFeatures()}
              />
            </div>
          </div>
        </div>
        {/*------------ Feature End -----------------*/}

        {/*------------ Feature Start -----------------*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
          <Shield size="4em" className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]"  />

          <div className="p-8">
            <h3 className="font-bold text-2xl my-6">Real Time Signals</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[250px]">
              {FeatureDescriptions.overviews.signals}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Real Time Signals"
                modalDescription={FeatureDescriptions.additional.signalFeatures()}
              />
            </div>
          </div>
        </div>
        {/*------------ Feature End -----------------*/}

        {/*-------------- Feature Start -----------------*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
          <MessageSquare size="4em"  className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]" fill="white"  />
          <div className="p-8">
            <h3 className="font-bold text-2xl my-6">Real Time Chat</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[250px]">
              {FeatureDescriptions.overviews.chat}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Chat"
                modalDescription={FeatureDescriptions.additional.chatFeatures()}
              />
            </div>
          </div>
        </div>
        {/*-------------- Feature End -----------------*/}

        {/*-------------- Feature Start -----------------*/}
        <div className="bg-white rounded-xl shadow-2xl relative">
          <div className="p-8">
            <Code size="4em" className="w-14 p-3 bg-indigo-600 text-white rounded-lg absolute top-[-25px] left-[45px]"   />
            <h3 className="font-bold text-2xl my-6">Custom Scripts</h3>
            <div className="text-gray-600 sm:text-sm md:text-xl pb-3 h-[250px]">
              {FeatureDescriptions.overviews.scripts}
            </div>
            <div className="flex justify-center">
              <FeatureModal
                btnTitle="More Info"
                modalTitle="Scripts"
                modalDescription={FeatureDescriptions.additional.scriptFeatures()}
              />
            </div>
          </div>
        </div>
        {/*-------------- Feature End -----------------*/}
      </div>
    </div>
  );
};

export default Features;
