import { usePopperTooltip } from "@tm/popper-tooltip";
import { localClasses } from "./x-styles";

export function D2_Basic() {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip();

    return (
        <div className={localClasses.demoSection}>
            <h1 className={localClasses.sectionHeader}>2. Basic example</h1>

            <button className={localClasses.trigger} type="button" ref={setTriggerRef}>
                Trigger element
            </button>

            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: "z-50 mt-2 inline-block rounded-md bg-gray-900 text-white text-sm px-3 py-2 shadow-lg", })}
                >
                    Tooltip element
                    <div
                        {...getArrowProps({ className: "absolute w-3 h-3 bg-gray-900 transform rotate-45", })}
                    />
                </div>
            )}
        </div>
    );
}
