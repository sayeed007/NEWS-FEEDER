import React from 'react';
import TimeAgo from '../common/utilities/TimeAgo';

const InfoPostWithBigImage = (props) => {

    return (
        <div
            className="col-span-12 grid grid-cols-12 gap-4"
            key={props?.defaultKey}
        >
            {/* info */}
            <div className="col-span-12 lg:col-span-4">
                <a href={props?.articleInfo?.url}
                    target="_blank" rel="noopener noreferrer"
                >
                    <h3
                        className="mb-2.5 text-2xl font-bold lg:text-[28px]"
                    >
                        {props?.articleInfo?.title}
                    </h3>
                </a>
                <p className="text-base text-[#5C5955]">
                    {props?.articleInfo?.description ? props?.articleInfo?.description : 'No description found'}
                </p>
                <p className="mt-5 text-base text-[#5C5955]">
                    <TimeAgo
                        timestamp={props?.articleInfo?.publishedAt}
                    />
                </p>
            </div>
            {/* thumb */}
            <div className="col-span-12 lg:col-span-8">
                <img
                    className="w-full"
                    src={props?.articleInfo?.urlToImage}
                    alt={props?.articleInfo?.source?.name}
                />
                <p className="mt-5 text-base text-[#5C5955]">
                    Illustration: {props?.articleInfo?.source?.name}
                </p>
            </div>
        </div>
    );
}

export default InfoPostWithBigImage;
