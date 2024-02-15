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


const categories = [
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
];


const MainBodyContentModified = (props) => {

    // Use the useRef hook to create a reference to the timeout ID
    const searchTimeoutRef = useRef(null); // Ref to store timeout ID

    const [searchDelay, setSearchDelay] = useState(2000);
    const [articles, setArticles] = useState([]);

    const { searchData: searchData, loading: loading, error: searchError, fetchSearchData: fetchSearchData } = useSearchQuery();


    useEffect(() => {

        if (props?.allNews?.articles?.length > 0) {

            let dummyAllArticles = props?.allNews?.articles;

            const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
                // Sort by urlToImage (description order)
                const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

                // If urlToImage is the same, sort by description length (descending order)
                const descriptionComparison = (b.description || '').length - (a.description || '').length;

                // If urlToImage and description length are the same, maintain the original order
                return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
            });

            setArticles([...sortedArticleArray]);
        } else {
            setArticles([]);
        }

    }, [props?.allNews]);


    useEffect(() => {

        if (props?.searchedKeyword && searchData?.result?.length > 0) {
            props.setSearchedAPICalled(true);

            let dummyAllArticles = searchData?.result;

            const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
                // Sort by urlToImage (description order)
                const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

                // If urlToImage is the same, sort by description length (descending order)
                const descriptionComparison = (b.description || '').length - (a.description || '').length;

                // If urlToImage and description length are the same, maintain the original order
                return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
            });

            setArticles([...sortedArticleArray]);
        } else {
            setArticles([]);
        };

    }, [searchData]);

    // Debounced search function with delay parameter
    const debouncedSearch = (query, delay = searchDelay) => {
        clearTimeout(searchTimeoutRef.current); // Clear previous timeout

        searchTimeoutRef.current = setTimeout(() => {
            // Perform actual search (API call, etc.)
            fetchSearchData(query);
            props.setSelectedCategory('');
        }, delay);
    };

    // useEffect for cleanup/optimization
    useEffect(() => {
        return () => clearTimeout(searchTimeoutRef.current);
    }, []);

    return (
        <>

            {(props?.allNewsLoading || loading) &&
                <Loader
                    activateLoader={(props?.allNewsLoading || loading)}
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
                                value={props?.searchedKeyword}
                                onChange={(e) => {
                                    props.setSearchedKeyWord(e.target.value);
                                    debouncedSearch(e.target.value);
                                }}
                            />
                            <span
                                className='flex justify-center px-2 bg-gray-200 cursor-pointer'
                                onClick={() => {
                                    if (props?.searchedKeyword) {
                                        fetchSearchData(props?.searchedKeyword);
                                        props.setSearchedAPICalled(true);
                                        props.setSelectedCategory('');
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
                                    setSearchDelay(Number(e.target.value))
                                }}
                                value={searchDelay}
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
                                style={(props?.selectedCategory === 'home' && !props?.searchedKeyword) ? styles.activeCategory : {}}
                                className='capitalize'
                                onClick={() => {
                                    props.setSelectedCategory('home');
                                    props.fetchNews('home');
                                    props.setSearchedKeyWord('');
                                    props.setSearchedAPICalled(false);
                                }}
                            >
                                Home
                            </a>
                        </li>
                        {categories.map((eachNewsCategory, newsCategoryIndex) => {
                            return (
                                <li key={`${eachNewsCategory}-${newsCategoryIndex}`}>
                                    <a
                                        style={(props?.selectedCategory === eachNewsCategory && !props?.searchedKeyword) ? styles.activeCategory : {}}
                                        className='capitalize'
                                        onClick={() => {
                                            props.setSelectedCategory(eachNewsCategory);
                                            props.fetchNews(eachNewsCategory);
                                            props.setSearchedKeyWord('');
                                            props.setSearchedAPICalled(false);
                                        }}
                                    >
                                        {eachNewsCategory}
                                    </a>
                                </li>
                            );
                        })}

                        <li key={'No Category Test'}>
                            <a
                                style={(props?.selectedCategory === '' && !props?.searchedKeyword) ? styles.activeCategory : {}}
                                className='capitalize'
                                onClick={() => {
                                    props.setSelectedCategory('');
                                    props.fetchNews('');
                                    props.setSearchedKeyWord('');
                                    props.setSearchedAPICalled(false);
                                }}
                            >
                                No Category Test
                            </a>
                        </li>

                        {(props?.searchedKeyword && props?.searchedAPICalled) &&
                            <li key={props?.searchedKeyword}>
                                <a
                                    style={props?.searchedKeyword ? styles.activeCategory : {}}
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


            {(props?.fetchingAllNewsError || searchError) ?
                <div className='my-8'>
                    <ErrorScreenView
                        message={'Error'}
                        detailedMessage={(props?.fetchingAllNewsError || searchError)}
                    />
                </div>
                :
                <>
                    {/*main */}
                    <main className="my-10 lg:my-14">

                        {articles?.length > 0 ?
                            <div className="container mx-auto grid grid-cols-12 gap-8">

                                {/* left */}
                                <div
                                    className="col-span-12 grid grid-cols-12 gap-6 self-start xl:col-span-8"
                                >
                                    {articles?.map((eachArticle, articleIndex) => {
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
                                        {articles?.map((eachArticle, articleIndex) => {
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
                                detailedMessage={props?.searchedKeyword ?
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

export default MainBodyContentModified;
