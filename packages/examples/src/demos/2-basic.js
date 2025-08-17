import * as React from 'react';
import ReactDOM from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';

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

  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-semibold mb-6">Basic example</h1>

      <button
        type="button"
        ref={setTriggerRef}
        className="rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-gray-800 text-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Trigger element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className:
              'z-50 mt-2 inline-block rounded-md bg-gray-900 text-white text-sm px-3 py-2 shadow-lg',
          })}
        >
          Tooltip element
          <div
            {...getArrowProps({
              className:
                'absolute w-3 h-3 bg-gray-900 transform rotate-45',
            })}
          />
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
