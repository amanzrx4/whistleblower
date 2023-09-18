import { Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import "./App.css";
import SubmissionCard from "./Card";
import SessionPage from "./SessionPage";

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export interface Data {
  createdAt: string;
  id: string;
  message: string;
  proof: string;
  proofHash: string;
  sessionId: string;
  updatedAt: string;
}

function App() {
  // const [sessionId, setSessionId] = useState("");
  // const [templateUrl, setTemplateUrl] = useState("");
  const [data, setData] = useState<Data[]>([]);
  const [, navigate] = useLocation();

  console.log("data", data);

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

  // useEffect(()=>{

  //   if(templateUrl === "") return;

  //   navigate("/session/"+templateUrl);

  // },[templateUrl])
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

  // if (submissionStatus === SubmissionStatus.completed) {
  //   return <Form sessionId={sessionId} />;
  // }

  // return (
  //   <div
  //     style={{
  //       width: "100%",
  //       height: "100%",
  //     }}
  //   >
  //     <Header
  //       links={[
  //         {
  //           link: "",
  //           label: "Home",
  //         },
  //       ]}
  //     />
  //   </div>
  // );

  return (
    <>
      <Route path="/session/:sessionId/:templateObj">
        {({ sessionId, templateObj }) => (
          // <div>something</div>
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
            {data.map((data) => {
              return <SubmissionCard key={data.id} {...data} />;
            })}
          </Flex>
        </div>
      </Route>
    </>
  );
}

export default App;
