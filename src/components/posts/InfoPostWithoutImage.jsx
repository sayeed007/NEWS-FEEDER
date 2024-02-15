import React from 'react';
import TimeAgo from '../common/utilities/TimeAgo';

const InfoPostWithoutImage = (props) => {
    return (
        <div
            className="col-span-12 md:col-span-6 lg:col-span-4"
            key={props?.defaultKey}
        >
            {/* info */}
            <div className="col-span-12 md:col-span-4">
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
                <p className="mt-5 text-base text-[#94908C]">
                    <TimeAgo
                        timestamp={props?.articleInfo?.publishedAt}
                    />
                </p>
            </div>
        </div>
    );
}

export default InfoPostWithoutImage;
