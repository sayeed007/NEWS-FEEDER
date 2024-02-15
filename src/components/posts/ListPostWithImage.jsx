import React from 'react';
import TimeAgo from '../common/utilities/TimeAgo';

const ListPostWithImage = (props) => {
    return (
        <div
            className="col-span-12 mb-6 md:col-span-8"
            key={props?.defaultKey}
        >
            <img
                className="w-full"
                src={props?.articleInfo?.urlToImage}
                alt={props?.articleInfo?.source?.name}
            />
            {/* info */}
            <div className="col-span-12 mt-6 md:col-span-4">
                <a href={props?.articleInfo?.url}
                    target="_blank" rel="noopener noreferrer"
                >
                    <h3
                        className="mb-2.5 text-xl font-bold lg:text-[20px]"
                    >
                        {props?.articleInfo?.title}
                    </h3>
                </a>
                <p className="text-base text-[#292219]">
                    {props?.articleInfo?.description ? props?.articleInfo?.description : 'No description found'}
                </p>
                <p className="mt-5 text-base text-[#94908C]">
                    <TimeAgo
                        timestamp={props?.articleInfo?.publishedAt}
                    />
                </p>
            </div>
        </div>
    );
}

export default ListPostWithImage;
