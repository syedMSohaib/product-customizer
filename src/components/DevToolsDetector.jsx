// DevToolsDetector.js
import React, { useEffect } from 'react';

const DevToolsDetector = () => {
  // Function to check if the developer tools are open
  const areDevToolsOpen = () => {
    // Perform checks to detect developer tools
    // (Note: This method may not work in all scenarios)
    return (
      window.outerWidth - window.innerWidth > 100 || // Chrome/Firefox
      window.outerHeight - window.innerHeight > 100 || // Chrome/Firefox
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ // React DevTools
    );
  };

  // Function to reload the page
  const reloadPageIfDevToolsOpen = () => {
    if (areDevToolsOpen()) {
      window.location.reload();
    }
  };

  // Periodically check for developer tools presence
  useEffect(() => {
    const intervalId = setInterval(reloadPageIfDevToolsOpen, 1000); // Check every 1 second

    // Cleanup: Clear the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <></>; // An empty fragment, as this component doesn't render any content
};

export default DevToolsDetector;
