import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as esbuild from "esbuild-wasm";

const container: any = document.getElementById("root");
const root = createRoot(container);
const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleSubmit = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });
    setCode(result.code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleSubmit}> Submit Code</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};
root.render(<App />);
