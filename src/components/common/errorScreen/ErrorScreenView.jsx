import React from 'react'
import ErrorScreen from '../../../assets/image/Error.jpg';



const ErrorScreenView = (props) => {
    return (
        <div style={{ height: '30vh' }} className='w-full justify-center items-center'>

            <div style={{ margin: '2vh 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={ErrorScreen} alt='No Item Here' style={{ height: '100px' }} />
            </div>

            <p style={{ fontWeight: 600, fontSize: '20px', textAlign: 'center', marginBottom: '0px', color: '#FF0000', }}>
                {props?.message ? props?.message : 'Nothing Here Yet!'}
            </p>

            <p style={{ color: '#FF0000', fontSize: '16px', textAlign: 'center' }}>
                {props?.detailedMessage ? props?.detailedMessage : ''}
            </p>
        </div>
    )
}


export default ErrorScreenView