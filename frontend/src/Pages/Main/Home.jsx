import React, { useState } from 'react'
import Search from '../../Components/Search'
// import { useAuth } from '../../Context/auth';
import axios from 'axios';
import Loader from '../../Components/Loader';

const Home = () => {
  // const { data, setFiltered } = useAuth();
  const [query, setQuery] = useState("");  
  const [images,setImages] = useState()
  const [loading,setLoading] = useState(false)
  // React.useEffect(() => {
  //   setFiltered(
  //     data?.filter(d => 
  //       d?.title
  //         ? d?.title?.toLowerCase().includes(query.toLowerCase())
  //         : d?.name?.toLowerCase().includes(query.toLowerCase())
  //     )
  //   );
  // }, [query, data, setFiltered]);


  const imageGenerator = async() =>{
    if(query.length===0){
     alert("Enter description")
      return;
    }else if(query.length<3){
      alert("Description should be of more than 2 characters")
      return;
    }
    const options = {
      method: 'POST', 
      url: 'https://ai-image-generator3.p.rapidapi.com/generate',
      headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': 'ai-image-generator3.p.rapidapi.com',
        'Content-Type': 'application/json' 
        },  
        data: {
          prompt: query, 
          page: 1
        }
      };
      
      try {
        setLoading(true)
        const response = await axios.request(options);
      console.log('API Response:', response); 
      console.log(response.data.results.images)
      setImages(response.data.results.images)
      
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
      // setQuery("")
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images?.length) % images?.length);
  };


  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "490px"
      }}>
        <div style={{
          boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          backgroundColor: "#e6e8e8",
          backdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
          webkitBackdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
          height: "100%",
          width: "350px" , padding:"20px 20px 0 20px" , fontWeight:"700" , marginTop:"10px" , fontFamily: "Georgia, serif" , fontSize:"30px" ,wordWrap:" break-word"

        }}> {query.length>0?query:"Whatever you will type in input box will be shown here...."}</div>

       <div style={{
      boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
      backgroundColor: "#e6e8e8",
      backdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
      webkitBackdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
      height: "100%",
      width: "65%",
      position: "relative"
    }}>
      <img
        src={images? images[currentIndex] :"https://plus.unsplash.com/premium_photo-1683141123111-c445910abc29?q=80&w=2139&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt="error"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover"
        }}
      />
      
      {images?.length > 1 && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "space-between",
          transform: "translateY(-50%)",
          padding: "0 20px"
        }}>
          <button
            onClick={prevImage}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          >
            &#8249; 
          </button>
          
          <button
            onClick={nextImage}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          >
             &#8250;
          </button>
        </div>
      )}


      
    </div>

      </div>

      <div style={{
        height: "60px",
        marginTop: "5px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 20px 0px 20px",
        zIndex: "999"
      }}>
      </div>
      <div style={{display:"flex" , justifyContent:"center", alignItems:"center" , marginTop:"-30px"}}>
        <Search query={query} setQuery={setQuery} /> &nbsp;
        <button 
      style={{
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        padding: '8px 14px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseOver={e => e.target.style.backgroundColor = '#000'}
      onMouseOut={e => e.target.style.backgroundColor = '#333'}

      onClick={()=>{imageGenerator()}}
    >
      Generate
    </button>
      </div>


      {loading?<Loader></Loader>:""}
    </>
  )
}

export default Home
