import { Button, Group, Text, Textarea } from "@mantine/core";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;
interface Props {
  sessionId: string;
}
const Form = ({ sessionId }: Props) => {
  const [input, setInput] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(BASE_URL + "/data/" + sessionId + "?type=message", {
        method: "POST",
        body: JSON.stringify({
          whistleBlowMessage: input,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.log("error form submit", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Group position="apart" mb={5}>
        <Text component="label" htmlFor="your-password" size="xl" weight={500}>
          Whistleblow something &#129323;
        </Text>
      </Group>
      <Textarea
        maxLength={1000}
        size="lg"
        style={{ width: "100%" }}
        variant="filled"
        minRows={8}
        required
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Whistleblow something"
        id="whistleblow"
      />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default Form;
