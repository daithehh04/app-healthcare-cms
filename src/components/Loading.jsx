import React from 'react';
import {
     HashLoader
} from 'react-spinners';

const Loading = ({ loading }) => {
     return (
          <div className="absolute inset-0 flex justify-center items-center h-screen w-screen z-10 bg-[#ffffff7d]">
               <HashLoader
                    color="#292929" loading={loading} size={150} />
          </div>
     );
};

export default Loading;