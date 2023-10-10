import { Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import "./App.css";
import SubmissionCard from "./Card";
import SessionPage from "./SessionPage";
import Header from "./Header";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export interface Data {
  createdAt: string;
  _id: string;
  message: string;
  proof: string;
  proofHash: string;
  sessionId: string;
  updatedAt: string;
}

export interface ProofObj {
  provider: string;
  ownerPublicKey: string;
  timestampS: string;
  witnessAddresses: string[];
  signatures: string[];
  redactedParameters: string;
  identifier: string;
  epoch: number;
  context: string;
}

function App() {
  const [data, setData] = useState<Data[]>([]);
  const [, navigate] = useLocation();

  const fetchAllSubmissions = async () => {
    return await fetch(BASE_URL + "/whistleblow");
  };

  useEffect(() => {
    fetchAllSubmissions().then((res) => {
      res.json().then((data) => {
        setData(data.data);
      });
    });
  }, []);

  const onGenerate = async () => {
    const res = await fetch((BASE_URL + "/generate") as string, {
      method: "POST",
    });
    const data = (await res.json()) as {
      sessionId: string;
      templateUrl: string;
    };

    const d = encodeURIComponent(JSON.stringify({ data: data.templateUrl }));

    const navigateString = "session/" + data.sessionId + "/" + d;
    navigate(navigateString);
  };
  console.log(data);

  return (
    <>
      <Route path="/">
        <Header />
      </Route>
      <Route path="/session/:sessionId/:templateObj">
        {({ sessionId, templateObj }) => (
          <SessionPage sessionId={sessionId!} templateObj={templateObj!} />
        )}
      </Route>
      <Route path="/">
        <div style={{ width: "100%" }}>
          <Button
            leftIcon={<IconPlus />}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={onGenerate}
            mb={"lg"}
          >
            Whistleblow
          </Button>

          <Flex gap={"lg"} direction={"column"}>
            {data.map((data) => (
              <SubmissionCard key={data._id} {...data} />
            ))}
          </Flex>
        </div>
      </Route>
    </>
  );
}

export default App;
