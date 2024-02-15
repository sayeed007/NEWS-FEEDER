import React, { useState, useEffect, useRef } from 'react';
import InfoPostWithoutImage from '../posts/InfoPostWithoutImage';
import InfoPostWithBigImage from '../posts/InfoPostWithBigImage';
import InfoPostWithSmallImage from '../posts/InfoPostWithSmallImage';
import ListPostWithoutImage from '../posts/ListPostWithoutImage';
import ListPostWithImage from '../posts/ListPostWithImage';
import DateWorldIcon from '../../assets/icons/DateWorldIcon.svg'
import LWSLogo from '../../assets/image/logo.png'
import Search from '../../assets/icons/search.svg'

import '../../styles/SearchBar.css'

import useNewsQuery from '../hooks/useNewsQuery';
import Loader from '../common/loader/Loader';
import useSearchQuery from '../hooks/useSearchQuery';
import EmptyScreenView from '../common/emptyScreen/EmptyScreenView';
import ErrorScreenView from '../common/errorScreen/ErrorScreenView';
import { useNewsContext } from '../context/NewsContext';

const styles = {
    activeCategory: {
        color: '#00d991',
        fontWeight: 'bold',
        fontSize: '24px'
    }
};

const currentDate = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);


const MainBodyContentContext = () => {

    const { state, dispatch } = useNewsContext();

    const { fetchSearchData: fetchSearchData } = useSearchQuery();
    const { fetchNews: fetchNews } = useNewsQuery();

    // Use the useRef hook to create a reference to the timeout ID
    const searchTimeoutRef = useRef(null); // Ref to store timeout ID

    useEffect(() => {

        if (state?.allNews?.articles?.length > 0) {

            let dummyAllArticles = state?.allNews?.articles;

            const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
                // Sort by urlToImage (description order)
                const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

                // If urlToImage is the same, sort by description length (descending order)
                const descriptionComparison = (b.description || '').length - (a.description || '').length;

                // If urlToImage and description length are the same, maintain the original order
                return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
            });

            dispatch({ type: 'SET_ARTICLES', payload: [...sortedArticleArray] });

        } else {
            dispatch({ type: 'SET_ARTICLES', payload: [] });
        }

    }, [state?.allNews]);


    useEffect(() => {

        if (state?.searchedKeyword && state?.searchData?.result?.length > 0) {

            let dummyAllArticles = state?.searchData?.result;

            const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
                // Sort by urlToImage (description order)
                const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

                // If urlToImage is the same, sort by description length (descending order)
                const descriptionComparison = (b.description || '').length - (a.description || '').length;

                // If urlToImage and description length are the same, maintain the original order
                return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
            });

            dispatch({
                type: 'SET_ARTICLES_AFTER_SEARCH', payload: {
                    articles: [...sortedArticleArray],
                    searchedAPICalled: true
                }
            });
        } else {
            dispatch({
                type: 'SET_ARTICLES_AFTER_SEARCH', payload: {
                    articles: [],
                    searchedAPICalled: true
                }
            });
        };

    }, [state?.searchData]);

    // Debounced search function with delay parameter
    const debouncedSearch = (query, delay = state?.searchDelay) => {
        clearTimeout(searchTimeoutRef.current); // Clear previous timeout

        searchTimeoutRef.current = setTimeout(() => {
            // Perform actual search (API call, etc.)
            fetchSearchData(query);

            dispatch({
                type: 'SET_SELECTED_CATEGORY', payload: {
                    selectedCategory: ''
                }
            });
        }, delay);
    };

    // useEffect for cleanup/optimization
    useEffect(() => {
        return () => clearTimeout(searchTimeoutRef.current);
    }, []);

    return (
        <>

            {(state?.allNewsLoading || state?.allNewsSearchLoading) &&
                <Loader
                    activateLoader={(state?.allNewsLoading || state?.allNewsSearchLoading)}
                />
            }


            {/*Navbar Starts*/}
            <nav className="border-b border-black py-6 md:py-8">
                <div
                    className="container mx-auto flex flex-wrap items-center justify-between gap-6"
                >
                    {/* date */}
                    <div className="flex items-center space-x-4">
                        <img
                            src={DateWorldIcon}
                            alt={'DateIcon'}
                        />
                        <span>
                            {formattedDate}
                        </span>
                    </div>

                    {/* Logo */}
                    <a href="/">
                        <img
                            className="max-w-[100px] md:max-w-[165px]"
                            src={LWSLogo}
                            alt="Lws"
                        />
                    </a>
                    {/* Logo Ends */}

                    {/* Search */}
                    <div className="flex flex-col items-center space-x-3 lg:space-x-8">
                        {/* SEARCH */}
                        <div
                            className='relative mb-2 flex'
                        >
                            <input
                                type="search"
                                name="search"
                                pattern=".*\S.*"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Search Here"
                                value={state?.searchedKeyword}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'SET_SELECTED_KEYWORD', payload: {
                                            searchedKeyword: e.target.value
                                        }
                                    });

                                    debouncedSearch(e.target.value);
                                }}
                            />
                            <span
                                className='flex justify-center px-2 bg-gray-200 cursor-pointer'
                                onClick={() => {
                                    if (state?.searchedKeyword) {
                                        fetchSearchData(state?.searchedKeyword);

                                        dispatch({
                                            type: 'SET_SELECTED_CATEGORY_AND_SEARCH_KEYWORD_TOGETHER', payload: {
                                                selectedCategory: '',
                                                searchedAPICalled: true,
                                                searchedKeyword: state?.searchedKeyword
                                            }
                                        });
                                    }
                                }}
                            >
                                <img
                                    src={Search}
                                    alt="search"

                                />
                            </span>
                        </div>
                        <div className='flex text-[12px]'>
                            Debounce Search with delay of

                            <select
                                onChange={(e) => {
                                    dispatch({
                                        type: 'SET_SEARCHED_DELAY', payload: {
                                            searchDelay: Number(e.target.value),
                                        }
                                    });
                                }}
                                value={state?.searchDelay}
                                className="appearance-none bg-white border border-gray-300 px-2 mx-1 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                            >
                                <option value={1000}>1</option>
                                <option value={2000}>2</option>
                                <option value={3000}>3</option>
                                <option value={4000}>4</option>
                                <option value={5000}>5</option>
                            </select>
                            sec
                        </div>
                    </div>
                </div>

                {/* categories */}
                <div className="container mx-auto mt-6">
                    <ul
                        className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold lg:text-base"
                    >
                        <li key={'home'}>
                            <a
                                style={(state?.selectedCategory === 'home' && !state?.searchedKeyword) ? styles.activeCategory : {}}
                                className='capitalize'
                                onClick={() => {
                                    fetchNews('home');

                                    dispatch({
                                        type: 'SET_SELECTED_CATEGORY_AND_SEARCH_KEYWORD_TOGETHER', payload: {
                                            selectedCategory: 'home',
                                            searchedAPICalled: false,
                                            searchedKeyword: ''
                                        }
                                    });
                                }}
                            >
                                Home
                            </a>
                        </li>
                        {state?.categories.map((eachNewsCategory, newsCategoryIndex) => {
                            return (
                                <li key={`${eachNewsCategory}-${newsCategoryIndex}`}>
                                    <a
                                        style={(state?.selectedCategory === eachNewsCategory && !state?.searchedKeyword) ? styles.activeCategory : {}}
                                        className='capitalize'
                                        onClick={() => {
                                            fetchNews(eachNewsCategory);

                                            dispatch({
                                                type: 'SET_SELECTED_CATEGORY_AND_SEARCH_KEYWORD_TOGETHER', payload: {
                                                    selectedCategory: eachNewsCategory,
                                                    searchedAPICalled: false,
                                                    searchedKeyword: ''
                                                }
                                            });
                                        }}
                                    >
                                        {eachNewsCategory}
                                    </a>
                                </li>
                            );
                        })}

                        <li key={'No Category Test'}>
                            <a
                                style={(state?.selectedCategory === '' && !state?.searchedKeyword) ? styles.activeCategory : {}}
                                className='capitalize'
                                onClick={() => {
                                    fetchNews('');

                                    dispatch({
                                        type: 'SET_SELECTED_CATEGORY_AND_SEARCH_KEYWORD_TOGETHER', payload: {
                                            selectedCategory: '',
                                            searchedAPICalled: false,
                                            searchedKeyword: ''
                                        }
                                    });
                                }}
                            >
                                No Category Test
                            </a>
                        </li>

                        {(state?.searchedKeyword && state?.searchedAPICalled) &&
                            <li key={state?.searchedKeyword}>
                                <a
                                    style={state?.searchedKeyword ? styles.activeCategory : {}}
                                    className='capitalize'
                                >
                                    Searched Result
                                </a>
                            </li>
                        }

                    </ul>
                </div>

            </nav>
            {/*Navbar Ends*/}


            {(state?.fetchingAllNewsError || state?.fetchingAllNewsSearchError) ?
                <div className='my-8'>
                    <ErrorScreenView
                        message={'Error'}
                        detailedMessage={(state?.fetchingAllNewsError || state?.fetchingAllNewsSearchError)}
                    />
                </div>
                :
                <>
                    {/*main */}
                    <main className="my-10 lg:my-14">

                        {state?.articles?.length > 0 ?
                            <div className="container mx-auto grid grid-cols-12 gap-8">

                                {/* left */}
                                <div
                                    className="col-span-12 grid grid-cols-12 gap-6 self-start xl:col-span-8"
                                >
                                    {state?.articles?.map((eachArticle, articleIndex) => {
                                        if (articleIndex % 3 !== 0 || articleIndex === 0) {
                                            if (articleIndex === 0) {
                                                return (
                                                    <InfoPostWithBigImage
                                                        defaultKey={`ArticleIndex-${articleIndex}`}
                                                        key={`ArticleIndex-${articleIndex}`}
                                                        articleInfo={eachArticle}
                                                    />
                                                )
                                            } else if (articleIndex === 1) {
                                                return (
                                                    <InfoPostWithSmallImage
                                                        defaultKey={`ArticleIndex-${articleIndex}`}
                                                        key={`ArticleIndex-${articleIndex}`}
                                                        articleInfo={eachArticle}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <InfoPostWithoutImage
                                                        defaultKey={`ArticleIndex-${articleIndex}`}
                                                        key={`ArticleIndex-${articleIndex}`}
                                                        articleInfo={eachArticle}
                                                    />
                                                )
                                            }
                                        }
                                    })
                                    }
                                </div>



                                {/* right */}
                                <div
                                    className="col-span-12 self-start xl:col-span-4"
                                >
                                    <div className="space-y-6 divide-y-2 divide-[#D5D1C9]">
                                        {state?.articles?.map((eachArticle, articleIndex) => {
                                            if (articleIndex % 3 === 0 && articleIndex !== 0) {

                                                if (articleIndex === 3) {
                                                    return (
                                                        <ListPostWithImage
                                                            defaultKey={`ArticleIndex-${articleIndex}`}
                                                            key={`ArticleIndex-${articleIndex}`}
                                                            articleInfo={eachArticle}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <ListPostWithoutImage
                                                            defaultKey={`ArticleIndex-${articleIndex}`}
                                                            key={`ArticleIndex-${articleIndex}`}
                                                            articleInfo={eachArticle}
                                                        />
                                                    )
                                                }
                                            }
                                        })
                                        }
                                    </div>
                                </div>

                            </div>
                            :
                            <EmptyScreenView
                                message={'No article found'}
                                detailedMessage={state?.searchedKeyword ?
                                    'No article is found based on your search keyword'
                                    :
                                    'No article is found based on your selected category'
                                }
                            />

                        }

                    </main>
                    {/*main ends*/}
                </>

            }
        </>
    );
}

export default MainBodyContentContext;
