// import { useState } from "react";
// import { animated, useTransition } from "@react-spring/web";
// import { usePopperTooltip } from "@tm/popper-tooltip";
// import "react-popper-tooltip/dist/styles.css";

// export function D1_Animaton() {
//     const [controlledVisible, setControlledVisible] = useState(false);

//     const {
//         getArrowProps,
//         getTooltipProps,
//         setTooltipRef,
//         setTriggerRef,
//     } = usePopperTooltip({
//         visible: controlledVisible,
//         onVisibleChange: setControlledVisible,
//     });

//     const transitions = useTransition(controlledVisible, null, {
//         from: { opacity: 0 },
//         enter: { opacity: 1 },
//         leave: { opacity: 0 },
//     });

//     return (
//         <div className="App">
//             <h1>react-popper-tooltip</h1>
//             <p>
//                 A show/hide animation example using{' '}
//                 <a href="https://www.react-spring.io/">react-spring</a> library.
//             </p>

//             <button type="button" ref={setTriggerRef}>
//                 Trigger element
//             </button>

//             {transitions.map(
//                 ({ item, key, props }) => item && (
//                     <animated.div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container', style: props, })} key={key}>
//                         Tooltip element
//                         <div {...getArrowProps({ className: 'tooltip-arrow' })} />
//                     </animated.div>
//                 )
//             )}
//         </div>
//     );
// }
