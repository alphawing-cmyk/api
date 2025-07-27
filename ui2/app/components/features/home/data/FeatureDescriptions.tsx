const FeatureDescriptions = {
  overviews: {
    metrics: (
      <span className="text-[18px] text-gray-600 font-light">
        Track various metrics across different markets and trading algorithms
        from all in one platform.
      </span>
    ),
    algos: (
      <span className="text-[18px] text-gray-600 font-light">
        Earn consistent returns with peace of mind. Trading bots take the
        emotion out of trading thus enabling consistent trades. Over 10+
        customizable trading bots to choose from.
      </span>
    ),
    platform: (
      <span className="text-[18px] text-gray-600 font-light">
        Synchronize all your trading accounts in one platform. We'll take care
        of the rest when it comes to managing your account using your platform's
        powerful api's.
      </span>
    ),
    signals: (
      <span className="text-[18px] text-gray-600 font-light">
        Various strategies are looking out in real time for signals across
        various markets. You will get access to these signals for you to either
        execute on your own or we can automatically execute / manage them for
        you.
      </span>
    ),
    chat: (
      <span className="text-[18px] text-gray-600 font-light">
        Engage in real-time conversations with fellow users, fostering a dynamic
        community where insights flow seamlessly. Our platform not only
        facilitates live chat but also ensures that trading strategies share
        alerts across diverse channels in which you can initiate trades from as
        well.
      </span>
    ),
    scripts: (
      <span className="text-[18px] text-gray-600 font-light">
        You can write custom Python scripts and integrate them with our systen
        to generate signals and to be able to trade using these signals.
      </span>
    ),
  },
  additional: {
    metricFeature: function () {
      return (
        <span>
          <span className="font-bold">Multi-Market Coverage</span>
          <br />
          <span className="my-2">
            The platform covers a wide range of markets, including but not
            limited to stock exchanges, commodity markets, currency markets, and
            more. This diversity allows users to gain insights into different
            sectors and geographical regions, enabling a holistic view of global
            economic trends.
          </span>
          <br />
          <br />
          <span className="font-bold">Real-Time Tracking</span>
          <br />
          <span className="my-2">
            One of the primary advantages is real-time tracking of market
            metrics. Users can access up-to-the-minute data on stock prices,
            commodity values, exchange rates, and other relevant indicators.
            This real-time information is crucial for making informed decisions
            in fast-paced financial environments.
          </span>
          <br />
          <br />
          <span className="font-bold">Comprehensive Metrics</span>
          <br />
          <span className="my-2">
            The platform likely tracks a variety of performance metrics such as
            market indices, stock prices, trading volumes, volatility, and
            economic indicators. This comprehensive approach enables users to
            analyze both macro and microeconomic factors influencing market
            behavior.
          </span>
          <br />
          <br />
          <span className="font-bold">Historical Data Analysis</span>
          <br />
          <span className="my-2">
            In addition to real-time tracking, the platform might offer
            historical data analysis. Users can review past market trends,
            identify patterns, and gain insights into how certain events have
            historically impacted markets. This historical perspective is
            valuable for making strategic decisions.
          </span>
          <br />
          <br />
          <span className="font-bold">Research and Analytics Tools</span>
          <br />
          <span className="my-2">
            Advanced research and analytics tools may be integrated, allowing
            users to conduct in-depth analyses. This could include technical
            analysis tools, financial modeling capabilities, and scenario
            planning features.
          </span>
          <br />
          <br />
        </span>
      );
    },
    algoFeatures: function () {
      return (
        <span className="flex flex-col">
          <span className="font-bold">Real-Time Market Data Integration:</span>
          <span className="my-2">
            Seamless integration with real-time market data feeds to ensure
            algorithms have access to the latest price, volume, and other
            relevant information. Timely data is critical for making informed
            trading decisions.
          </span>
          <span className="font-bold">Share and Post custom algorithms:</span>
          <span className="my-2">
            Users can create their own trading strategies and share it with
            others. Direct implenetation of the trading strategies is not
            currently supported, however users can submit their strategies to be
            implemebted, and we can review / implement them for you.
          </span>
          <span className="font-bold">Paper Trading (Simulated Trading):</span>
          <span className="my-2">
            A simulated trading environment that enables users to test their
            algorithms in real-market conditions without risking actual capital.
            This feature is crucial for gaining confidence in the algorithm's
            performance before deploying it in live markets.
          </span>
          <span className="font-bold">Execution Strategies:</span>
          <span className="my-2">
            Support for various execution strategies, including market orders,
            limit orders, and more advanced strategies such as algorithmic
            execution and smart order routing. This flexibility allows users to
            implement different trading styles.
          </span>
        </span>
      );
    },
    signalFeatures: function () {
      return (
        <span className="flex flex-col">
          <span className="font-bold">Real-Time Market Insights:</span>
          <span className="my-2">
            Seamless integration with real-time market data feeds to ensure
            algorithms have access to the latest price, volume, and other
            relevant information. Timely data is critical for making informed
            trading decisions.
          </span>
          <span className="font-bold">Share and Post custom algorithms:</span>
          <span className="my-2">
            Users can create their own trading strategies and share it with
            others. Direct implenetation of the trading strategies is not
            currently supported, however users can submit their strategies to be
            implemebted, and we can review / implement them for you.
          </span>
          <span className="font-bold">Paper Trading (Simulated Trading):</span>
          <span className="my-2">
            A simulated trading environment that enables users to test their
            algorithms in real-market conditions without risking actual capital.
            This feature is crucial for gaining confidence in the algorithm's
            performance before deploying it in live markets.
          </span>
          <span className="font-bold">Execution Strategies:</span>
          <span className="my-2">
            Support for various execution strategies, including market orders,
            limit orders, and more advanced strategies such as algorithmic
            execution and smart order routing. This flexibility allows users to
            implement different trading styles.
          </span>
        </span>
      );
    },
    platformFeatures: function () {
      return (
        <span className="flex flex-col">
          <span className="font-bold">Multiple Platform Support</span>
          <span className="my-2">
            We currently support the following platforms below:
            <span className="flex flex-col justify-center items-center my-2">
              <span className="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 min-w-[300px]  
                               max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                <span
                  role="button"
                  className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all 
                            hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                  <span className="text-center w-full">Oanda</span>
                </span>
                <span
                  role="button"
                  className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all 
                            hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                  <span className="text-center w-full">Kraken</span>
                </span>
                <span
                  role="button"
                  className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all 
                            hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                  <span className="text-center w-full">Alpaca</span>
                </span>
              </span>
            </span>
            Our plaform is always expanding and we will continue to be introduce
            new integrations with other platforms.
          </span>
          <span className="font-bold">Order Execution</span>
          <span className="my-2">
            You can execute trades directly to your platform through our order
            execution engine.
          </span>
        </span>
      );
    },
    chatFeatures: function () {
      return (
        <span className="flex flex-col">
          <span className="font-bold">Real-Time Messaging</span>
          <span className="my-2">
            Instant messaging for quick and responsive communication.
          </span>
          <span className="font-bold">Channels</span>
          <span className="my-2">
            Create group channels and message each other. Each trading strategy
            has their own channel as well in which you can choose to take trades
            from or not.
          </span>
          <span className="font-bold">Offline Messaging</span>
          <span className="my-2">
            Send messages that will be delivered once the recipient comes
            online.
          </span>
        </span>
      );
    },
    scriptFeatures: function () {
      return (
        <span className="flex flex-col">
          <span className="font-bold">Api Integration</span>
          <span className="my-2">
            You can use our api to retrieve data and use it to test your trading strategies.
          </span>
          <span className="font-bold">Share Scripts</span>
          <span className="my-2">
            You can share scripts with others and have people review it.
          </span>
        </span>
      );
    },
  },
};

export default FeatureDescriptions;
