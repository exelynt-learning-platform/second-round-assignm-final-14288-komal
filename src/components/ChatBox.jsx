import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { clearError } from "../redux/features/chatSlice";
import Message from "./Message";
import Loader from "./Loader";

const ChatBox = () => {
  const { messages, loading, error } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
      {messages.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
          <p className="text-lg">
            Start a conversation by typing a message below.
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}

     
      {loading && <Loader />}

   
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-400 hover:text-red-600 font-bold cursor-pointer"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

     
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
