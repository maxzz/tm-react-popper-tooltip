import { type CSSProperties, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { VirtualElement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { useControlledState, useGetLatest, generateBoundingClientRect, } from './utils.js';
import type { Config, PopperOptions, PropsGetterArgs, TriggerType, } from './types.js';

const virtualElement: VirtualElement = {
    getBoundingClientRect: generateBoundingClientRect(),
};

const defaultConfig: Config = {
    closeOnOutsideClick: true,
    closeOnTriggerHidden: false,
    defaultVisible: false,
    delayHide: 0,
    delayShow: 0,
    followCursor: false,
    interactive: false,
    mutationObserverOptions: {
        attributes: true,
        childList: true,
        subtree: true,
    },
    offset: [0, 6],
    trigger: 'hover',
};

export function usePopperTooltip(config: Config = {}, popperOptions: PopperOptions = {},) {
    // Merging options with default options.
    // Keys with undefined values are replaced with the default ones if any.
    // Keys with other values pass through.
    const finalConfig = (
        Object.keys(defaultConfig) as Array<keyof typeof defaultConfig>
    ).reduce(
        (config, key) => ({
            ...config,
            [key]: config[key] !== undefined ? config[key] : defaultConfig[key],
        }),
        config,
    );

    const defaultModifiers = useMemo(
        () => [{ name: 'offset', options: { offset: finalConfig.offset } }],
        Array.isArray(finalConfig.offset) ? finalConfig.offset : [],
    );

    const finalPopperOptions = {
        ...popperOptions,
        placement: popperOptions.placement || finalConfig.placement,
        modifiers: popperOptions.modifiers || defaultModifiers,
    };

    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
    const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);
    const [visible, setVisible] = useControlledState({
        initial: finalConfig.defaultVisible,
        value: finalConfig.visible,
        onChange: finalConfig.onVisibleChange,
    });

    const timer = useRef<number>(0);
    useEffect(
        () => () => clearTimeout(timer.current),
        []
    );

    const { styles, attributes, ...popperProps } = usePopper(
        finalConfig.followCursor ? virtualElement : triggerRef,
        tooltipRef,
        finalPopperOptions,
    );

    const update = popperProps.update;

    const getLatest = useGetLatest({ visible, triggerRef, tooltipRef, finalConfig, });

    const isTriggeredBy = useCallback(
        (trigger: TriggerType) => {
            return Array.isArray(finalConfig.trigger)
                ? finalConfig.trigger.includes(trigger)
                : finalConfig.trigger === trigger;
        },
        Array.isArray(finalConfig.trigger) ? finalConfig.trigger : [finalConfig.trigger]
    );

    const hideTooltip = useCallback(
        () => {
            clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setVisible(false), finalConfig.delayHide,);
        }, [finalConfig.delayHide, setVisible]
    );

    const showTooltip = useCallback(
        () => {
            clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setVisible(true), finalConfig.delayShow,);
        }, [finalConfig.delayShow, setVisible]
    );

    const toggleTooltip = useCallback(
        () => {
            if (getLatest().visible) {
                hideTooltip();
            } else {
                showTooltip();
            }
        }, [getLatest, hideTooltip, showTooltip]
    );

    // Handle click outside
    useEffect(
        () => {
            if (!getLatest().finalConfig.closeOnOutsideClick) return;

            const handleClickOutside: EventListener = (event) => {
                const { tooltipRef, triggerRef } = getLatest();
                const target = event.composedPath?.()?.[0] || event.target;
                if (target instanceof Node) {
                    if (
                        tooltipRef != null &&
                        triggerRef != null &&
                        !tooltipRef.contains(target) &&
                        !triggerRef.contains(target)
                    ) {
                        hideTooltip();
                    }
                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [getLatest, hideTooltip]
    );

    // Trigger: click
    useEffect(
        () => {
            if (triggerRef == null || !isTriggeredBy('click')) {
                return;
            }

            const controller = new AbortController();
            triggerRef.addEventListener('click', toggleTooltip, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [triggerRef, isTriggeredBy, toggleTooltip]
    );

    // Trigger: double-click
    useEffect(
        () => {
            if (triggerRef == null || !isTriggeredBy('double-click')) {
                return;
            }

            const controller = new AbortController();
            triggerRef.addEventListener('dblclick', toggleTooltip, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [triggerRef, isTriggeredBy, toggleTooltip]
    );

    // Trigger: right-click
    useEffect(
        () => {
            if (triggerRef == null || !isTriggeredBy('right-click')) {
                return;
            }

            const preventDefaultAndToggle: EventListener = (event) => {
                // Don't show the context menu
                event.preventDefault();
                toggleTooltip();
            };

            const controller = new AbortController();
            triggerRef.addEventListener('contextmenu', preventDefaultAndToggle, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [triggerRef, isTriggeredBy, toggleTooltip]
    );

    // Trigger: focus
    useEffect(
        () => {
            if (triggerRef == null || !isTriggeredBy('focus')) {
                return;
            }

            const controller = new AbortController();
            triggerRef.addEventListener('focus', showTooltip, { signal: controller.signal });
            triggerRef.addEventListener('blur', hideTooltip, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]
    );

    // Trigger: hover on trigger
    useEffect(
        () => {
            if (triggerRef == null || !isTriggeredBy('hover')) {
                return;
            }

            const controller = new AbortController();
            triggerRef.addEventListener('mouseenter', showTooltip, { signal: controller.signal });
            triggerRef.addEventListener('mouseleave', hideTooltip, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]
    );

    // Trigger: hover on tooltip, keep it open if hovered
    useEffect(
        () => {
            if (tooltipRef == null || !isTriggeredBy('hover') || !getLatest().finalConfig.interactive) {
                return;
            }

            const controller = new AbortController();
            tooltipRef.addEventListener('mouseenter', showTooltip, { signal: controller.signal });
            tooltipRef.addEventListener('mouseleave', hideTooltip, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [tooltipRef, isTriggeredBy, showTooltip, hideTooltip, getLatest]
    );

    // Handle closing tooltip if trigger hidden
    const isReferenceHidden = popperProps?.state?.modifiersData?.hide?.isReferenceHidden;
    useEffect(
        () => {
            if (finalConfig.closeOnTriggerHidden && isReferenceHidden) {
                hideTooltip();
            }
        }, [finalConfig.closeOnTriggerHidden, hideTooltip, isReferenceHidden]
    );

    // Handle follow cursor
    useEffect(
        () => {
            if (!finalConfig.followCursor || triggerRef == null) {
                return;
            }

            function setMousePosition({ clientX, clientY, }: { clientX: number; clientY: number; }) {
                virtualElement.getBoundingClientRect = generateBoundingClientRect(clientX, clientY);
                update?.();
            }

            const controller = new AbortController();
            triggerRef.addEventListener('mousemove', setMousePosition, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }, [finalConfig.followCursor, triggerRef, update]
    );

    // Handle tooltip DOM mutation changes (aka mutation observer)
    useEffect(() => {
        if (tooltipRef == null || update == null || finalConfig.mutationObserverOptions == null) {
            return;
        }

        const observer = new MutationObserver(update);
        observer.observe(tooltipRef, finalConfig.mutationObserverOptions);
        return () => {
            observer.disconnect();
        };
    }, [finalConfig.mutationObserverOptions, tooltipRef, update]);

    // Tooltip props getter
    const getTooltipProps = (args: PropsGetterArgs = {}) => {
        return {
            ...args,
            style: { ...args.style, ...styles['popper'], } as CSSProperties,
            ...attributes['popper'],
            'data-popper-interactive': finalConfig.interactive,
        };
    };

    // Arrow props getter
    const getArrowProps = (args: PropsGetterArgs = {}) => {
        return {
            ...args,
            ...attributes['arrow'],
            style: { ...args.style, ...styles['arrow'], } as CSSProperties,
            'data-popper-arrow': true,
        };
    };

    return {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        tooltipRef,
        triggerRef,
        visible,
        ...popperProps,
    };
}
