import React from "react";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="conatiner px-4 2xl:px-20 mx-auto my-20">
      <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded-lg">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-8 max-w-md">
            Download Mobile App for Better Experience
          </h1>
          <div className="flex gap-4">
            <a href="#" className="inline-block">
              <img src={assets.play_store} alt="play-store" className="h-12" />
            </a>
            <a href="#" className="inline-block">
              <img src={assets.app_store} alt="app-store" className="h-12" />
            </a>
          </div>
        </div>
        <img
          src={assets.app_main_img}
          alt="app-download"
          className="absolute right-0 bottom-0 w-80 mr-32 max-lg:hidden"
        />
      </div>
    </div>
  );
};

export default AppDownload;
