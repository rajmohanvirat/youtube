import React, { useEffect } from 'react'
import "./PlayVideo.css"
import moment from 'moment';

import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { useState } from 'react'
import { API_KEY, value_Conventer } from '../../Data'
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
  const {videoId}=useParams()

  const [apiData,setApiData] = useState(null);

  const [channelData,setChannelData] = useState(null);

  const [commentData,setCommentData]= useState([])

  const fetchVideoData = async () => {
    const videoDetails_url=` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
    
    await fetch(videoDetails_url).then(res=>res.json()).then(data => setApiData(data.items[0]))
  }

  const fetchOtherData = async () => {
    try {
      if (!apiData || !apiData.snippet || !apiData.snippet.channelId) {
        console.warn("API Data is missing or invalid. Skipping fetchOtherData.");
        return;
      }
  
      // Fetching channel data
      const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelRes = await fetch(channelDataUrl);
      const channelDataJson = await channelRes.json();
  
      if (channelDataJson.items && channelDataJson.items.length > 0) {
        setChannelData(channelDataJson.items[0]);
      } else {
        console.warn("No channel data found.");
        setChannelData(null);
      }
  
      // Fetching comments
      const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}`;
      const commentRes = await fetch(commentUrl);
      const commentJson = await commentRes.json();
  
      if (commentJson.items) {
        setCommentData(commentJson.items);
      } else {
        console.warn("No comments found.");
        setCommentData([]);
      }
    } catch (error) {
      console.error("Error fetching additional data:", error);
      setChannelData(null);
      setCommentData([]);
    }
  };
  

  useEffect(()=>{
    fetchVideoData()
    
  },[videoId])

  useEffect(() => {
    if (apiData && apiData.snippet && apiData.snippet.channelId) {
      fetchOtherData();
    }
  }, [apiData]); 

  return (
    <div className='play-video'>
      <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1` } frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <h3>{apiData?apiData.snippet.title:'Title Here'}</h3>
      <div className="play-video-info">
        <p>{apiData?value_Conventer(apiData.statistics.viewCount):'160k'}views   &bull;  {apiData?moment(apiData.snippet.publishedAt).fromNow():'2days ago'}</p>
        <div>
          <span><img src={like} alt=""/>{apiData?value_Conventer(apiData.statistics.likeCount):150}</span>
          <span><img src={dislike} alt=""/>15</span>
          <span><img src={share} alt=""/>share</span>
          <span><img src={save} alt=""/>save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt=""/>
        <div>
          <p>{apiData?apiData.snippet.channelTitle:'MY CHANNEL'}</p>
<span>{channelData?value_Conventer(channelData.statistics.subscriberCount):"1M"} Subscribers</span>          
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"Description here"}</p>
      <hr />
      <h4>{apiData?value_Conventer(apiData.statistics.commentCount):"130 "}Comments
      </h4>
          {commentData.map((item,index)=>{
            
            return (
              <div key={index} className="comment">

            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} 
          alt="" />
            <div>
              <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>2 days ago</span></h3>
              <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>{value_Conventer(item.snippet.topLevelComment.snippet.likeCount)}</span>
              <img src={dislike} alt="" />
             
            </div>
            </div>
        
          </div>

            )
          })}
          
      </div>
    </div>
  )
}

export default PlayVideo