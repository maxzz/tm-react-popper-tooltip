import { useState } from "react";
import { usePopperTooltip } from "@tm/popper-tooltip";
import { localClasses } from "./x-styles";
// import "react-popper-tooltip/dist/styles.css";

export function D4_Controlled() {
    const [controlledVisible, setControlledVisible] = useState(false);

    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: 'click',
        closeOnOutsideClick: false,
        visible: controlledVisible,
        onVisibleChange: setControlledVisible,
    });

    return (
        <div className={localClasses.demoSection}>
            <h1 className={localClasses.sectionHeader}>4. react-popper-tooltip</h1>
            <p className={localClasses.explanation}>
                This is an example of using react-popper-tooltip as a controlled
                component.
            </p>

            <button className={localClasses.trigger} type="button" ref={setTriggerRef}>
                Trigger element
            </button>

            <p className={`pt-4 ${localClasses.explanation}`}>
                External state control - click the button below to show/hide the tooltip.
            </p>
            <button className={localClasses.trigger} onClick={() => setControlledVisible(!controlledVisible)}>
                External control
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
    );
}
