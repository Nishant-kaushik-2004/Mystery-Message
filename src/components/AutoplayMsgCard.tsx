import React from "react";

interface Message {
  title: string;
  content: string;
  received: string;
}

interface AutoplayMsgCardProps {
  message: Message;
}

const AutoplayMsgCard: React.FC<AutoplayMsgCardProps> = ({ message }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg sm:p-7 p-5 sm:m-2.5 max-w-[500px] animate-fade-in sm:hover:scale-105 transition-transform duration-300 ease-in-out">
      <p className="text-base mb-2.5 text-gray-700">{message.title}</p>
      <p className="text-xl sm:text-2xl mb-2.5 text-gray-800">{message.content}</p>
      <p className="text-sm text-gray-500">{message.received}</p>
    </div>
  );
};

export default AutoplayMsgCard;
