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
        <div className="grid gap-8">
            <D2_Basic />
            <D3_CloseOnEsc />
            <D4_Controlled />
            <D5_PersistOnceMounted />
            <D6_Portal />
            {/* 
            <D1_Animaton />
            <D7_RenderProp />
            */}
        </div>
    );
}
