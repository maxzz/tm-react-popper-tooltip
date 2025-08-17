import { useState } from "react";
import "./App.css"

// import { D1_Animaton } from "./demos/1-animation"
import { D2_Basic } from "./demos/2-basic";
import { D3_CloseOnEsc } from "./demos/3-close-on-esc";
import { D4_Controlled } from "./demos/4-controlled";
import { D5_PersistOnceMounted } from "./demos/5-persist-once-mounted";
import { D6_Portal } from "./demos/6-portal";
// import { D7_RenderProp } from "./demos/7-render-prop.tsx1";

export function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <D2_Basic />
            <D3_CloseOnEsc />
            <D4_Controlled />
            <D5_PersistOnceMounted />
            <D6_Portal />
            {/* <D7_RenderProp />  */}
            {/* 
            <D1_Animaton />
            */}
            {/* <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p> */}
        </>
    );
}
