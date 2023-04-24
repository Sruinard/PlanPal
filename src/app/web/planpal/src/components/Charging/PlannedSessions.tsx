import { faker } from "@faker-js/faker";
export interface ISession {
  content: string;
}

// create 5 sessions with random lorum ipsum text
export const ISessionPlanned: ISession[] = [];
for (let i = 0; i < 5; i++) {
  ISessionPlanned.push({
    content: faker.lorem.paragraph(),
  });
}
