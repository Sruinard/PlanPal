import React, { useState } from "react";
import { Timeline } from "antd";
import { ISession, ISessionPlanned } from "./PlannedSessions";

const PlannedSessions: React.FC = () => {
  const [session, setSession] = useState<ISession[]>(ISessionPlanned);
  //   convert session to a list of dict with key children and value to session.content
  const sessionList = session.map((session) => {
    return { children: session.content };
  });

  return (
    <>
      <Timeline items={sessionList} />
    </>
  );
};

export default PlannedSessions;
