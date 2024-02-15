import React from 'react';
import TimeAgo from '../common/utilities/TimeAgo';

const InfoPostWithSmallImage = (props) => {
    return (
        <div
            className="col-span-12 grid grid-cols-12 gap-4 lg:col-span-8"
            key={props?.defaultKey}
        >
            {/* info */}
            <div className="col-span-12 md:col-span-6">
                <a href={props?.articleInfo?.url}
                    target="_blank" rel="noopener noreferrer"
                >
                    <h3
                        className="mb-2.5 text-xl font-bold lg:text-2xl"
                    >
                        {props?.articleInfo?.title}
                    </h3>
                </a>
                <p className="text-base text-[#292219]">
                    {props?.articleInfo?.description ? props?.articleInfo?.description : 'No description found'}
                </p>
                <p className="mt-5 text-base text-[#5C5955]">
                    <TimeAgo
                        timestamp={props?.articleInfo?.publishedAt}
                    />
                </p>
            </div>
            {/* thumb */}
            <div className="col-span-12 md:col-span-6">
                <img
                    className="w-full"
                    src={props?.articleInfo?.urlToImage}
                    alt={props?.articleInfo?.source?.name}
                />
            </div>
        </div>
    );
}

export default InfoPostWithSmallImage;
