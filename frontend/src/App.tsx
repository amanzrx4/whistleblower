import { Button } from "@mantine/core";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button variant="outline" onClick={() => setCount((c) => c + 1)}>
        {count} clicks
      </Button>
    </>
  );
}

export default App;
