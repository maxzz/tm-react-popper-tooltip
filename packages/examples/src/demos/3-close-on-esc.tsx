import { useEffect, useState } from "react";
import { usePopperTooltip } from "@tm/popper-tooltip";
// import "react-popper-tooltip/dist/styles.css";

export function D3_CloseOnEsc() {
    const [controlledVisible, setControlledVisible] = useState(false);

    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: "click",
        visible: controlledVisible,
        onVisibleChange: setControlledVisible,
    });

    useEffect(() => {
        const handleKeyDown = ({ key }: KeyboardEvent) => {
            if (key === "Escape") {
                setControlledVisible(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="App">
            <h1>react-popper-tooltip</h1>
            <p>
                This is an example of how to close the tooltip pressing the Esc button.
            </p>

            <button type="button" ref={setTriggerRef}>
                Trigger element
            </button>

            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: "tooltip-container" })}
                >
                    Tooltip element
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </div>
    );
}
