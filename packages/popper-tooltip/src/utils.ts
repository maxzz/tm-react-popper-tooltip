import { useRef, useCallback, useState } from "react";

// kudos to @tannerlinsley https://twitter.com/tannerlinsley
/**
 ```md
 Here's how it works:
    * It takes a value val of generic type T as input.
    * It creates a ref (ref) initialized with val.
    * On every render, it updates ref.current to the latest val.
    * It returns a memoized callback (using useCallback) that, when called, returns the current value of ref.current.

 Purpose:
    This hook is useful for always accessing the latest value inside closures (like event handlers or effects), 
    avoiding stale values without causing unnecessary re-renders.

Example usage:
    You might use useGetLatest to safely reference the latest state or prop inside asynchronous callbacks.

Setting ref.current during render (as in your useGetLatest hook) is generally safe in React, 
but it’s not the typical pattern. React refs are mutable and updating them does not trigger a re-render, 
so it won’t break React’s rendering flow.

However, React’s documentation recommends updating refs inside effects (like useEffect) rather than during render, 
to avoid unexpected behavior if React ever changes how it handles refs.

For your use case—keeping the latest value available for callbacks—it’s a common pattern and widely used, 
but be aware it’s a workaround and not officially documented as best practice.

Summary:
    * It works and is safe for this pattern.
    * Not officially recommended by React docs.
    * If React’s internals change, this pattern could become unsafe, but for now it’s widely used.    
```
*/
export function useGetLatest<T>(val: T) {
    const ref = useRef<T>(val);
    ref.current = val;
    return useCallback(() => ref.current, []);
}

const noop = () => {
    // do nothing
};

export function useControlledState<T>({ initial, value, onChange = noop, }: { initial?: T; value?: T; onChange?: (state: T) => void; }): [T, (state: T) => void] {
    if (initial === undefined && value === undefined) {
        throw new TypeError('Either "value" or "initial" variable must be set. Now both are undefined');
    }

    const [state, setState] = useState(initial);

    const getLatest = useGetLatest(state);

    const set = useCallback(
        (updater: T) => {
            const state = getLatest();

            const updatedState = typeof updater === 'function' ? updater(state) : updater;

            if (typeof updatedState.persist === 'function') {
                updatedState.persist();
            }

            setState(updatedState);
            if (typeof onChange === 'function') {
                onChange(updatedState);
            }
        },
        [getLatest, onChange],
    );

    const isControlled = value !== undefined;

    return [isControlled ? value! : state!, isControlled ? onChange : set];
}

export function generateBoundingClientRect(x = 0, y = 0): () => DOMRect {
    return () => ({
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
        x: 0,
        y: 0,
        toJSON: () => null,
    });
}
