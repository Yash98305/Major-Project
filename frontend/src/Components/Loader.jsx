import React from 'react'
import {ProgressBar} from "react-loader-spinner"
const Loader = () => {
  return (
    <div style={{display:"flex" , justifyContent:"center" , alignItems:"center"  , position:"absolute" , top:"40%", left:"60%"}}>
        <ProgressBar
  visible={true}
  height="120"
  width="120"
  color="#4fa94d"
  ariaLabel="progress-bar-loading"
//   wrapperStyle={{zIndex:"1000"}}
  wrapperClass=""
  />
    </div>
  )
}

export default Loader