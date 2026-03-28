import ChatBox from "./ChatBox";
import InputBox from "./Inbox";


const Home = () => {
  return (
    <div className="flex flex-col h-[85vh] sm:h-[80vh]">
      <ChatBox />
      <InputBox />
    </div>
  );
};

export default Home;
