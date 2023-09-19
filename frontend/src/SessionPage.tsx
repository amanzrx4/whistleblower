import { Button, Flex, Loader, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
// import { SubmissionStatus } from "./App";
import { useEffect, useState } from "react";
import Form from "./Form";

enum SubmissionStatus {
  idle = "idle",
  pending = "pending",
  completed = "completed",
}
const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

interface Props {
  sessionId: string;
  templateObj: string;
}

const SessionPage = ({ sessionId, templateObj }: Props) => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.idle
  );

  const templateUrl = (
    JSON.parse(decodeURIComponent(templateObj)) as {
      data: string;
    }
  ).data;

  const onFetchSessionData = async (id: string) => {
    const res = await fetch(BASE_URL + "/status/" + id);
    const data = (await res.json()) as {
      status: SubmissionStatus;
      sessionId: string;
    };
    setSubmissionStatus(data.status);
  };

  useEffect(() => {
    if (sessionId === "") return;

    if (submissionStatus === SubmissionStatus.idle) {
      onFetchSessionData(sessionId);
      return;
    }

    if (submissionStatus === SubmissionStatus.completed) return;
    setInterval(() => {
      onFetchSessionData(sessionId);
    }, 2000);
  }, [sessionId, submissionStatus]);

  if (submissionStatus === SubmissionStatus.completed) {
    return <Form sessionId={sessionId} />;
  }
  return (
    <Flex
      gap={"md"}
      direction={"column"}
      align={"center"}
      justify={"center"}
      style={{
        minHeight: "100vh",
        marginTop: "-200px",
      }}
    >
      <QRCodeSVG value={templateUrl || ""} />

      <Button
        size="xs"
        variant="default"
        onClick={() => {
          navigator.clipboard.writeText(templateUrl);
        }}
      >
        Copy
      </Button>
      <Text
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        sx={{ fontFamily: "Greycliff CF, sans-serif" }}
        ta="center"
        fz="xl"
        fw={700}
      >
        Scan the QR code and submit reclaim proofs
      </Text>
      <Text size="xl" fw="bold">
        Status: {submissionStatus.toUpperCase()}
      </Text>
      {submissionStatus === SubmissionStatus.pending && <Loader />}
    </Flex>
  );
};

export default SessionPage;
