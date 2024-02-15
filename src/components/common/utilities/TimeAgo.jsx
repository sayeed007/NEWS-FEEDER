import React from 'react';

const TimeAgo = ({ timestamp }) => {
    const currentDate = new Date();
    const time = new Date(timestamp);
    const timeDiff = currentDate - time;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    var finalTime = '';

    if (minutes < 60) {
        finalTime = `${minutes} min ago`;
    }
    else if (hours < 24) {
        finalTime = `${hours} hour ago`;
    }
    else if (days === 1) {
        finalTime = 'Yesterday';
    }
    else if (days < 3) {
        finalTime = `${days} days ago`;
    }
    else {
        const formattedDate = time.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        finalTime = formattedDate;
    }

    return (
        <>
            {finalTime}
        </>
    )
};


export default TimeAgo;
