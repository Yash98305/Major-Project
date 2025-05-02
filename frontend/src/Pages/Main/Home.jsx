import React, { useContext, useEffect, useState } from 'react'
import Search from '../../Components/Search'
import { useAuth } from '../../Context/auth';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { toast } from "react-toastify"
import { saveAs } from 'file-saver'
import img from "../../Assets/noresult.png"
import welImg from "../../Assets/welcome.png"
const Home = () => {
  const [query, setQuery] = useState("");  
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);
  const { auth, api,URL,KEY,HOST } = useAuth();
  const [history, setHistory] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const imageGenerator = async () => {
    if (query.length === 0) {
      toast.error("Enter description");
      return;
    } else if (query.length < 3) {
      toast.error("Description should be of more than 2 characters");
      return;
    }
    const options = {
      method: 'POST',
      url: URL,
      headers: {
        'x-rapidapi-key': KEY,
        'x-rapidapi-host': HOST,
        'Content-Type': 'application/json'
      },
      data: {
        prompt: query,
        page: 1
      }
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      const generatedImages = response.data.results.images;
      setImages(generatedImages);
      const userId = auth?.userId;
      await axios.post(`${api}/auth/history-save`, {
        userId,
        prompt: query,
        images: generatedImages,
      });
      getHistory();
      setQuery('');
    } catch (error) {
      toast.error("Image generation error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images?.length) % images?.length);
  };

  const getHistory = async () => {
    try {
      const res = await axios.get(`${api}/auth/history/${auth?.userId}`);
      setHistory(res?.data?.history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, [api, auth]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url, {
        mode: 'cors'
      });
      const blob = await response.blob();
      saveAs(blob, 'image.jpg');
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Image download failed. Try again.");
    }
  };

  return (
    <>
      {/* Fullscreen Modal */}
      {fullScreenImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          flexDirection: 'column'
        }}>
          <button
            onClick={() => setFullScreenImage(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 30,
              background: 'transparent',
              border: 'none',
              fontSize: 30,
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ❌
          </button>
          <img
            src={fullScreenImage}
            alt="Full View"
            style={{
              maxHeight: '90vh',
             
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          />
          <button
      onClick={() => downloadImage(fullScreenImage)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        marginTop: '20px',
        backgroundColor: isPressed ? '#1e7e34' : '#28a745',  // darker when pressed
        color: 'white',
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: "pointer",
        boxShadow: isPressed ? 'inset 0 2px 4px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.1s ease-in-out'
      }}
    >
      ⬇ Download
    </button>
        </div>
      )}

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
          width: "350px", padding: "20px 20px 0 20px", fontWeight: "700", marginTop: "10px", fontFamily: "Georgia, serif", fontSize: "20px", wordWrap: " break-word"
        }}>
          {history?.length > 0 ? (
            history.map((data, ind) => (
              <div key={ind}
                style={{
                  cursor: "pointer",
                  marginBottom: 10
                }}
                onClick={() => {
                  setQuery(data.prompt);
                  setImages(data.images);
                  setCurrentIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {data?.prompt}
                <div style={{ opacity: "0.7", fontSize: "10px", textAlign: "right" }}>{formatDate(data?.createdAt)}</div>
              </div>
            ))
          ) : (
            <div>Enter Your Prompt Here...</div>
          )}
        </div>

        <div style={{
         height: "102%",
          width: "65%",
          marginRight:10,
          position: "relative"
        }}>
          <img
          
          src={
  !images
    ? welImg
    : images.length === 0
    ? img
    : images[currentIndex]
}
            onClick={() => images && setFullScreenImage(images[currentIndex])}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              cursor: "zoom-in",
              padding:7,
              boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          backgroundColor: "#e6e8e8",
          backdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
          webkitBackdropFilter: "blur(20px) saturate(160%) contrast(45%) brightness(140%)",
          backgroundColor: 'transparent',
          mixBlendMode: 'multiply', 
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
      }}></div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-30px" }}>
        <Search query={query} setQuery={setQuery} /> &nbsp;
        <button
          style={{
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            padding: '8px 14px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#000'}
          onMouseOut={e => e.target.style.backgroundColor = '#333'}
          onClick={imageGenerator}
        >
          Generate
        </button>
      </div>

      {loading ? <Loader /> : ""}
    </>
  );
};

export default Home;
