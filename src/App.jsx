import React from "react";
import Home from "./components/Home";

const App = () => {
  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-300 font-bold text-lg text-center bg-blue-600 text-white">
          AI Chatbot
        </div>

        <Home />
      </div>
    </div>
  );
};

export default App;
