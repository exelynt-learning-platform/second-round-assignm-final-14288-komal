const Message = ({ msg }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={`p-3 rounded-lg max-w-[75%] sm:max-w-[70%] wrap-break-word whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white rounded-bl-none"
            : "bg-gray-300 text-gray-900 rounded-br-none"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default Message;
