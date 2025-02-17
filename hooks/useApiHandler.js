import { useState, useCallback } from "react";

const useApiHandler = (apiFunction) => {
  const [apiState, setApiState] = useState({
    error: null,
    loading: false,
    success: false,
    data: null,
  });

  const resetState = () => {
    setApiState({
      error: null,
      loading: false,
      success: false,
      data: null,
    });
  };

  const execute = useCallback(
    async (...args) => {
      setApiState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        const response = await apiFunction(...args);
        setApiState({
          loading: false,
          success: true,
          data: response,
          error: null,
        });
        return response;
      } catch (error) {
        setApiState({
          loading: false,
          success: false,
          data: null,
          error,
        });
        // throw error; 
      }
    },
    [apiFunction]
  );

  return { apiState, execute, resetState };
};

export default useApiHandler;
