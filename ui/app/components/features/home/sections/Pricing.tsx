const Pricing = () => {
    return (
      <div className="w-full py-[10rem] px-4 bg-white mt-[100px]" id="pricing">
        <p className="text-center text-5xl font-semibold text-black">Pricing</p>
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
          {/* <!------------- Start Card ---------------> */}
          <div className="w-full shadow-xl flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300 bg-white mt-[50px]">
            <h2 className="text-4xl font-bold text-center py-8 text-black">
              Free
            </h2>
            <p className="text-center text-4xl font-bold text-black">$0</p>
            <div className="text-center font-medium">
              <p className="py-2 border-b mx-8 mt-8 text-black">
                Platform is currently in active development
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <button className="text-black bg-tmGolden w-[200px] rounded-md font-medium my-6 px-6 py-3 cursor-pointer">
                Start Here
              </button>
            </div>
          </div>
          {/* <!------------- End Card ---------------> */}
        </div>
      </div>
    );
  };
  
  export default Pricing;
  