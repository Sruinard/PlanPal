import React from "react";
// create a typescript interface for the chat data
// use the following data as a starting point
// {
//     text: "Hello, I'm PlanPal. I'm here to help you with your cybersecurity needs. What can I help you with today?",
//     id: 1,
//     user: {
//       _id: 2,
//       name: "PlanPal",
//       avatar: "https://placeimg.com/140/140/any",
//     },
//     createdAt: new Date(),
//     system: true,
//   },

const data = [
  {
    text: "Hello, I'm PlanPal. I'm here to help you with your cybersecurity needs. What can I help you with today?",
    id: 1,
    user: {
      _id: 2,
      name: "PlanPal",
      avatar: "https://placeimg.com/140/140/any",
    },
    createdAt: new Date(),
    system: true,
  },
  {
    text: "I'm looking for a cybersecurity solution for my business.",
    id: 2,
    user: {
      _id: 1,
      name: "User",
    },
    createdAt: new Date(),
  },
  {
    text: "Certainly, there are potential cyber attack risks associated with artificial intelligence. Some of these risks include hackers targeting AI systems to steal data or disrupt operations, as well as the possibility of AI systems being trained on biased or malicious data. It's important for organizations to implement strong security measures and regularly update their AI systems to mitigate these risks. Would you like more information on this topic?",
    id: 3,
    user: {
      _id: 2,
      name: "PlanPal",
      avatar: "https://placeimg.com/140/140/any",
    },
    createdAt: new Date(),
    system: true,
  },
  {
    text: "Certainly, there are potential cyber attack risks associated with artificial intelligence. Some of these risks include hackers targeting AI systems to steal data or disrupt operations, as well as the possibility of AI systems being trained on biased or malicious data. It's important for organizations to implement strong security measures and regularly update their AI systems to mitigate these risks. Would you like more information on this topic?",
    id: 4,
    user: {
      _id: 2,
      name: "PlanPal",
      avatar: "https://placeimg.com/140/140/any",
    },
    createdAt: new Date(),
    system: true,
  },
  {
    text: "Certainly, there are potential cyber attack risks associated with artificial intelligence. Some of these risks include hackers targeting AI systems to steal data or disrupt operations, as well as the possibility of AI systems being trained on biased or malicious data. It's important for organizations to implement strong security measures and regularly update their AI systems to mitigate these risks. Would you like more information on this topic?",
    id: 5,
    user: {
      _id: 2,
      name: "PlanPal",
      avatar: "https://placeimg.com/140/140/any",
    },
    createdAt: new Date(),
    system: true,
  },
  {
    text: "Certainly, there are potential cyber attack risks associated with artificial intelligence. Some of these risks include hackers targeting AI systems to steal data or disrupt operations, as well as the possibility of AI systems being trained on biased or malicious data. It's important for organizations to implement strong security measures and regularly update their AI systems to mitigate these risks. Would you like more information on this topic?",
    id: 6,
    user: {
      _id: 2,
      name: "PlanPal",
      avatar: "https://placeimg.com/140/140/any",
    },
    createdAt: new Date(),
    system: true,
  },
];

interface ChatModel {
  text: string;
  id: number;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  system?: boolean;
}

const Data: ChatModel[] = data;

export { Data, ChatModel };
