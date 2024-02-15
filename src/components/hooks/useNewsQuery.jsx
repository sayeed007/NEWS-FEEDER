import React, { useEffect } from 'react';
import { useNewsContext } from '../context/NewsContext';



const useNewsQuery = () => {

    const { state, dispatch } = useNewsContext();



    useEffect(() => {
        fetchNews('home');
    }, []);

    const fetchNews = async (category) => {
        try {
            dispatch({
                type: 'SET_LOADING_AND_ERROR_DURING_FETCHING_NEWS', payload: {
                    fetchingAllNewsError: null,
                    allNewsLoading: true
                }
            });

            let apiUrl;
            const baseApiUrl = import.meta.env.VITE_REACT_APP_BASE_API_URL || 'http://localhost:8000/v2';


            if (category === 'home') {
                const categoryRequests = state?.categories.map(async (singleCategory) => {
                    const apiUrl = `${baseApiUrl}/top-headlines?category=${singleCategory}`

                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        const errorMessage = await response.text();
                        throw new Error(`HTTP error! Status: ${response.status}. Message: ${JSON?.parse(errorMessage)?.message}`);
                    }

                    const data = await response.json();
                    return { category, data };
                });

                const results = await Promise.all(categoryRequests);

                let dummyAllResults = { articles: [] };
                results?.forEach((singleResult) => {
                    dummyAllResults['articles'] = [
                        ...dummyAllResults['articles'],
                        ...singleResult?.data?.articles
                    ]
                })

                dispatch({
                    type: 'SET_LOADING_AND_DATA_DURING_FETCHING_NEWS', payload: {
                        allNews: dummyAllResults,
                        allNewsLoading: false
                    }
                });

            } else if (category) {
                apiUrl = `${baseApiUrl}/top-headlines?category=${category}`;
            } else {
                apiUrl = `${baseApiUrl}/top-headlines`;
            }


            if (category !== 'home') {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const errorMessage = await response.text(); // Extract error message from response body
                    throw new Error(`HTTP error! Status: ${response.status}. Message: ${JSON?.parse(errorMessage)?.message}`);
                }

                const data = await response.json();

                dispatch({
                    type: 'SET_LOADING_AND_DATA_DURING_FETCHING_NEWS', payload: {
                        allNews: data,
                        allNewsLoading: false
                    }
                });

            };

        } catch (error) {
            dispatch({
                type: 'SET_LOADING_AND_ERROR_DURING_FETCHING_NEWS', payload: {
                    fetchingAllNewsError: error.message,
                    allNewsLoading: false
                }
            });

        }
    };

    return { fetchNews };
};

export default useNewsQuery;
