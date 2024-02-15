// NewsContext.js
import React, { createContext, useReducer, useContext } from 'react';



const NewsContext = createContext();

const initialState = {
    allNews: [],

    allNewsLoading: false,
    allNewsSearchLoading: false,

    fetchingAllNewsError: null,
    fetchingAllNewsSearchError: null,

    selectedCategory: 'home',
    searchedKeyword: '',
    searchedAPICalled: false,

    categories: [
        "general",
        "business",
        "entertainment",
        "health",
        "science",
        "sports",
        "technology",
    ],

    searchDelay: 2000,
    articles: [],
    searchData: [],

};

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ARTICLES':
            return {
                ...state,
                articles: action.payload
            };
        case 'SET_ARTICLES_AFTER_SEARCH':
            return {
                ...state,
                articles: action.payload.articles,
                searchedAPICalled: action.payload.searchedAPICalled,
            };
        case 'SET_LOADING_AND_ERROR_DURING_FETCHING_NEWS':
            return {
                ...state,
                fetchingAllNewsError: action.payload.fetchingAllNewsError,
                allNewsLoading: action.payload.allNewsLoading,
            };
        case 'SET_LOADING_AND_DATA_DURING_FETCHING_NEWS':
            return {
                ...state,
                allNews: action.payload.allNews,
                allNewsLoading: action.payload.allNewsLoading,
            };
        case 'SET_LOADING_AND_ERROR_DURING_SEARCHING_NEWS':
            return {
                ...state,
                fetchingAllNewsSearchError: action.payload.fetchingAllNewsSearchError,
                allNewsSearchLoading: action.payload.allNewsSearchLoading,
            };
        case 'SET_LOADING_AND_DATA_DURING_SEARCHING_NEWS':
            return {
                ...state,
                searchData: action.payload.searchData,
                allNewsSearchLoading: action.payload.allNewsSearchLoading,
            };
        case 'SET_SELECTED_CATEGORY':
            return {
                ...state,
                selectedCategory: action.payload.selectedCategory,
            };
        case 'SET_SELECTED_KEYWORD':
            return {
                ...state,
                searchedKeyword: action.payload.searchedKeyword,
            };
        case 'SET_SELECTED_CATEGORY_AND_SEARCH_KEYWORD_TOGETHER':
            return {
                ...state,
                selectedCategory: action.payload.selectedCategory,
                searchedAPICalled: action.payload.searchedAPICalled,
                searchedKeyword: action.payload.searchedKeyword,
            };
        case 'SET_SEARCHED_DELAY':
            return {
                ...state,
                searchDelay: action.payload.searchDelay,
            };



        default:
            return state;
    }
};

const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    return (
        <NewsContext.Provider value={{ state, dispatch }}>{children}</NewsContext.Provider>
    );
};

const useNewsContext = () => {
    return useContext(NewsContext);
};

export { TaskProvider, useNewsContext };
