import FeatureModal from "../components/FeatureModal";
import FeatureDescriptions from "../data/FeatureDescriptions";
import {
  Waypoints,
  ChartNoAxesCombined,
  RefreshCw,
  Shield,
  MessageSquare,
  Code,
} from "lucide-react";

const features = [
  {
    title: "Metrics",
    icon: ChartNoAxesCombined,
    overview: FeatureDescriptions.overviews.metrics,
    modalDescription: FeatureDescriptions.additional.metricFeature(),
  },
  {
    title: "Strategies",
    icon: Waypoints,
    overview: FeatureDescriptions.overviews.algos,
    modalDescription: FeatureDescriptions.additional.algoFeatures(),
  },
  {
    title: "Platform Support",
    icon: RefreshCw,
    overview: FeatureDescriptions.overviews.platform,
    modalDescription: FeatureDescriptions.additional.platformFeatures(),
  },
  {
    title: "Real Time Signals",
    icon: Shield,
    overview: FeatureDescriptions.overviews.signals,
    modalDescription: FeatureDescriptions.additional.signalFeatures(),
  },
  {
    title: "Real Time Chat",
    icon: MessageSquare,
    overview: FeatureDescriptions.overviews.chat,
    modalDescription: FeatureDescriptions.additional.chatFeatures(),
  },
  {
    title: "Custom Scripts",
    icon: Code,
    overview: FeatureDescriptions.overviews.scripts,
    modalDescription: FeatureDescriptions.additional.scriptFeatures(),
  },
];

const Features = () => {
  return (
    <div className="w-full bg-background py-20 px-4" id="features">
      {/* Hero Row */}
      <div className="mx-auto max-w-[1240px] grid md:grid-cols-2 items-center gap-8">
        <img
          src="/home/laptop.jpg"
          alt="Trading laptop"
          className="w-[500px] mx-auto rounded-xl shadow-lg"
        />
        <div className="flex flex-col justify-center animate__animated animate__fadeInUp">
          <p className="text-green-600 text-lg font-semibold tracking-wide">
            Alpha Wing Trading Platform
          </p>
          <h2 className="text-3xl md:text-4xl font-bold py-2">
            Manage everything in one platform
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Built using a powerful Python backend, price data is updated in real time. Strategies continuously run across stocks, crypto, and currencies, generating signals for manual or automated trading.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-x-10 gap-y-20 mt-32 max-w-[1240px] mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="relative bg-card rounded-2xl shadow-xl p-8 pt-14 transition-transform hover:scale-[1.02] hover:shadow-2xl group flex flex-col"
            >
              {/* Icon Badge */}
              <div className="absolute top-[-30px] left-6 bg-indigo-600 text-white rounded-xl p-3 shadow-lg">
                <Icon size={32} />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground mb-6 min-h-[160px] text-sm md:text-base leading-relaxed">
                {feature.overview}
              </p>

              {/* Modal Trigger aligned to bottom */}
              <div className="mt-auto flex justify-center">
                <FeatureModal
                  btnTitle="More Info"
                  modalTitle={feature.title}
                  modalDescription={feature.modalDescription}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
