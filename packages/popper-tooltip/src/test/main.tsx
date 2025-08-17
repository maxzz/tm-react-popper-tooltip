import * as React from "react";
import ReactDOM from "react-dom/client";
import { usePopperTooltip } from "../main.js";
import "react-popper-tooltip/dist/styles.css";

function App() {
    return <Example />;
}

function Example() {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip();

    return (<>
        <div className="App">
            <h1>Basic example</h1>

            <button type="button" ref={setTriggerRef}>
                Trigger element
            </button>

            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: 'tooltip-container' })}
                >
                    Tooltip element
                    <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                </div>
            )}
        </div>
    </>);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

//https://codesandbox.io/p/sandbox/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/basic?file=%2Fsrc%2Findex.js%3A1%2C1-44%2C1
//https://github.com/mohsinulhaq/react-popper-tooltip
//https://popper.js.org/docs/v2
//https://floating-ui.com/docs/useFloating
