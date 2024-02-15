import React, { useState, useEffect } from 'react';
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


const MainBodyContent = () => {

    const [selectedCategory, setSelectedCategory] = useState('');
    const [articles, setArticles] = useState([]);

    const [searchedKeyword, setSearchedKeyWord] = useState('');

    // THIS FETCHING IS FOR CATEGORY GETTING
    const { newsData: allCategoryNews, error: fetchingAllDataError } = useNewsQuery();

    const { newsData: allNews, loading: allNewsLoading, error: fetchingAllNewsError, fetchData: fetchNews } = useNewsQuery();

    const { searchData: searchData, loading: loading, error: searchError, fetchSearchData: fetchSearchData } = useSearchQuery();


    useEffect(() => {
        fetchNews(selectedCategory);

        // Fetch  news based on category
    }, [selectedCategory]);

    useEffect(() => {
        let dummyAllArticles = [];


        if (selectedCategory) {
            dummyAllArticles = allNews?.articles;
        } else {
            Object.entries(allNews)?.forEach(([categoryKey, categoryValue], categoryIndex) => {
                dummyAllArticles = [...dummyAllArticles, ...categoryValue?.articles]
            });
        }

        const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
            // Sort by urlToImage (description order)
            const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

            // If urlToImage is the same, sort by description length (descending order)
            const descriptionComparison = (b.description || '').length - (a.description || '').length;

            // If urlToImage and description length are the same, maintain the original order
            return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
        });


        if (sortedArticleArray.length > 0) {
            setArticles([...sortedArticleArray]);
        } else {
            setArticles([]);

        };

    }, [allNews]);



    useEffect(() => {

        if (searchedKeyword) {
            let dummyAllArticles = searchData?.result;

            const sortedArticleArray = dummyAllArticles?.sort((a, b) => {
                // Sort by urlToImage (description order)
                const urlToImageComparison = (b.urlToImage || '').length - (a.urlToImage || '').length;

                // If urlToImage is the same, sort by description length (descending order)
                const descriptionComparison = (b.description || '').length - (a.description || '').length;

                // If urlToImage and description length are the same, maintain the original order
                return urlToImageComparison !== 0 ? urlToImageComparison : descriptionComparison;
            });


            if (sortedArticleArray.length > 0) {
                setArticles([...sortedArticleArray]);
            } else {
                setArticles([]);
            };
        }

    }, [searchData]);


    return (
        <>

            {(allNewsLoading) &&
                <Loader
                    activateLoader={(allNewsLoading)}
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
                    <div className="flex items-center space-x-3 lg:space-x-8">
                        {/* <input
                            type="search"
                            name="search"
                            pattern=".*\S.*"
                            onChange={(e) => setSearchedKeyWord(e?.target?.value)}
                        />
                        <span>
                            <img
                                src={Search}
                                alt='searchHere'
                                onClick={() => {
                                    fetchSearchData(searchedKeyword);
                                    setSelectedCategory('');
                                }}
                            />
                        </span> */}

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
                                value={searchedKeyword}
                                onChange={(e) => setSearchedKeyWord(e.target.value)}
                            />
                            <span
                                className='flex justify-center px-2 bg-gray-200 cursor-pointer'
                                onClick={() => {
                                    fetchSearchData(searchedKeyword);
                                    setSelectedCategory('');
                                }}
                            >
                                <img
                                    src={Search}
                                    alt="search"

                                />
                            </span>
                        </div>

                        {/* <form action="javascript:" class="search-bar">
                            <input type="search" name="search" pattern=".*\S.*" required />
                            <button class="search-btn" type="submit">
                                <span>Search</span>
                            </button>
                        </form> */}
                    </div>
                </div>

                {/* categories */}
                {!(fetchingAllDataError || fetchingAllNewsError || searchError) &&
                    <div className="container mx-auto mt-6">
                        <ul
                            className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold lg:text-base"
                        >
                            <li key={'all'}>
                                <a
                                    style={selectedCategory === '' ? styles.activeCategory : {}}
                                    className='capitalize'
                                    onClick={() => setSelectedCategory('')}
                                >
                                    All
                                </a>
                            </li>
                            {Object.keys(allCategoryNews).map((eachNewsCategory, newsCategoryIndex) => {
                                return (
                                    <li key={`${eachNewsCategory}-${newsCategoryIndex}`}>
                                        <a
                                            style={selectedCategory === eachNewsCategory ? styles.activeCategory : {}}
                                            className='capitalize'
                                            onClick={() => setSelectedCategory(eachNewsCategory)}
                                        >
                                            {eachNewsCategory}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                }

            </nav>
            {/*Navbar Ends*/}


            {(fetchingAllDataError || fetchingAllNewsError || searchError) ?
                <div className='my-8'>
                    <ErrorScreenView
                        message={'Error'}
                        detailedMessage={(fetchingAllDataError || fetchingAllNewsError || searchError)}
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
                                detailedMessage={searchedKeyword ?
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

export default MainBodyContent;
