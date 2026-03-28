import { useDispatch, useSelector } from "react-redux";
import { sendMessage, addUserMessage } from "../redux/features/chatSlice";
import { useState } from "react";


const InputBox = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.chat);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    dispatch(addUserMessage(input.trim()));
    dispatch(sendMessage(input.trim()));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex p-3 sm:p-4 border-t border-gray-300 bg-white gap-2">
      <input
        className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
        aria-label="Message input"
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base cursor-pointer"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
};

export default InputBox;
