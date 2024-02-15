import { useState, useEffect } from 'react';
import { useNewsContext } from '../context/NewsContext';

const useSearchQuery = () => {
    const { state, dispatch } = useNewsContext();


    const fetchSearchData = async (keyword) => {
        if (keyword) {
            try {
                dispatch({
                    type: 'SET_LOADING_AND_ERROR_DURING_SEARCHING_NEWS', payload: {
                        fetchingAllNewsSearchError: null,
                        allNewsSearchLoading: true
                    }
                });

                let apiUrl;
                const baseApiUrl = import.meta.env.VITE_REACT_APP_BASE_API_URL || 'http://localhost:8000/v2';


                apiUrl = `${baseApiUrl}/search?q=${keyword}`;


                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const errorMessage = await response.text(); // Extract error message from response body
                    throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorMessage}`);
                }

                const data = await response.json();

                dispatch({
                    type: 'SET_LOADING_AND_DATA_DURING_SEARCHING_NEWS', payload: {
                        searchData: data,
                        allNewsSearchLoading: false
                    }
                });


            } catch (error) {
                dispatch({
                    type: 'SET_LOADING_AND_ERROR_DURING_SEARCHING_NEWS', payload: {
                        fetchingAllNewsSearchError: error.message,
                        allNewsSearchLoading: false
                    }
                });
            }
        }
    };

    return { fetchSearchData };
};

export default useSearchQuery;
