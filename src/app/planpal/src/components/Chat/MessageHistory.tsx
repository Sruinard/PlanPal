// import faker to generate random messages
import React from "react";
import { faker } from "@faker-js/faker";

export interface IMessage {
  content: string;
  isUser: boolean;
}

// create 10 messages with random lorum ipsum text
export const messageHistory: IMessage[] = [];
for (let i = 0; i < 10; i++) {
  messageHistory.push({
    content: faker.lorem.paragraph(),
    isUser: Math.random() > 0.5,
  });
}
