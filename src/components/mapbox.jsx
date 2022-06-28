import React,{useState,useEffect} from 'react'
import Map from 'react-map-gl';
import ReactTimeAgo from 'react-time-ago'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker,Popup } from 'react-map-gl';
import Register from './Register';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Login from './Login';

const getUser=()=>{
  const  user=localStorage.getItem("user")
  return user
}

const Mapbox = () => {
 
  const [register, setregister] = useState(false)
  const [login, setlogin] = useState(false)
 
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentusernamme, setcurrentusernamme] = useState(getUser())
  const [editId,seteditId]=useState(null)
  const [editData,setEditData]=useState(null)
  const [title, settitle] = useState('')
  const [desc, setdesc] = useState('')
  const [fajr, setfajr] = useState('')
  const [asr, setasr] = useState('')
  const [magrib, setmagrib] = useState('')
  const [isha,setisha] = useState('')
  const [jummah, setjummah] = useState('')
  const [dhuhr, setdhuhr] = useState('')
  const [rating, setrating] = useState('')
  const [viewport, setViewport] = useState({
    latitude: '',
    longitude:'',
    zoom: 11,
  });
const oneditChange=(e)=>{
  const name=e.target.name;
        const value=e.target.value;
        setEditData(values =>({
            ...values, [name]:value
        }))
}

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const {lng, lat} = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
    setCurrentPlaceId(null)
   console.log(lng,lat)
  };

  const registerclick=()=>{
    setregister(!register)
    setlogin(false)
  }
  const loginclick=()=>{
    setregister(false)
    setlogin(!login)
  }

 const editItem=(elem)=>{
seteditId(elem)
setCurrentPlaceId(null)
try{
  axios.get(`https://mosquelocation.herokuapp.com/pin/${elem}`)
  .then(data=>setEditData(data.data))
}catch(err){
  console.log(err)
}
 } 
 const updateData=(e)=>{
  e.preventDefault()
  try{
    axios.put(`https://mosquelocation.herokuapp.com/pin/${editId}`,editData)
    .then(data=>console.log('updated'))
    .then(()=>setEditData(null))
    
  }catch(err){
    console.log(err)
  }
  
 }
const handleSubmit=(e)=>{
e.preventDefault();
const arr={"username":currentusernamme, "title":title,"desc":desc,"fajr":fajr,"dhuhr":dhuhr,"asr":asr,"magrib":magrib,"isha":isha,"jummah":jummah,"rating":rating,"long":newPlace.long,"lat":newPlace.lat}
       
axios.post(
 'https://mosquelocation.herokuapp.com/pin',
     arr)
     .then(res => {
         if (res.status === 200){
           console.log('review created')
           setPins([...pins,res.data])
         }
         else {
          
         Promise.reject()
        
         }
         settitle('')
         setdesc('')
         setrating('')
     })
     .catch(err => console.log('Something went wrong',err))
}

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("https://mosquelocation.herokuapp.com/pin");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [editData]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
  
      setViewport({ ...viewport, latitude: position.coords.latitude, longitude: position.coords.longitude });
    });
  }, [])
  

  const logout=()=>{
    localStorage.setItem("user",'')
    setcurrentusernamme('')
  }

useEffect(() => {
const user=localStorage.getItem('user')
setcurrentusernamme(user)
}, [login,logout])


    return (
       <div style={{ height: "100vh", width: "100%" }}>
     {viewport.latitude!=="" &&   <Map 
      initialViewState={{
        longitude:viewport.longitude||"88.46957952139968",
        latitude: viewport.latitude||'22.60613198936946',
        zoom: viewport.zoom
      }}
      mapboxAccessToken="pk.eyJ1Ijoic2FsYWh1ZGRpbjEyMyIsImEiOiJjbDRrbnNmemoxN21kM2xtZXRvbW50bmxzIn0.-HiqPBE5BYv0XcMztG6pqA"
      style={{width: "100%", height: "100%"}}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      getCursor={(e) => "crosshair"}
      onViewportChange={(viewport) => setViewport(viewport)}
     onDblClick={currentusernamme&&handleAddClick}
    >
      {pins.map((p) =>
      <>
    
     <Marker  pickable="true" longitude={p.long} latitude={p.lat} anchor="bottom">
     <LocationOnIcon style={{color:"blue",cursor:"pinter", fontSize: 3.5 * viewport.zoom, color:currentusernamme === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",}}  onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
    </Marker>
    {p._id === currentPlaceId &&  (
      <Popup
      key={p._id}
      latitude={p.lat}
      longitude={p.long}
        anchor="right"
        closeButton={true}
        closeOnClick={false}
        onClose={() => setCurrentPlaceId(null)}>
           <div className="card">
             
                  <h4 className="place">{(p.title).toUpperCase()}</h4>
              <p>{Array(p.rating).fill(<StarIcon className="star" />)}</p> 
                 <p>FAJR : {p.fajr}am DHUHR :{p.dhuhr}pm</p>
                 <p> ASR :{p.asr}pm MAGRIB :{p.magrib} pm</p>
                 <p> ISHA :{p.isha}pm JUMMAH :{p.jummah}pm</p>
                 <p>Details :{p.desc}</p>
                 
                <p> Created by <b>{p.username}</b> at <ReactTimeAgo date= {p.createdAt} locale="en-US"/></p>
                   
                 
                <button className="btnedit" onClick={()=>editItem(p._id)} type="submit">
                      Edit
                    </button>
                </div>
      </Popup>
      
      )}
      </>)}

      {editData&& (
        <><Marker draggable pickable="true" longitude={editData.long} latitude={editData.lat} anchor="bottom">
              <LocationOnIcon style={{ color: "blue", cursor: "pinter", fontSize: 7 * viewport.zoom }}  />
            </Marker>
            <Popup
              latitude={editData.lat||"88"}
              longitude={editData.long||'22'}
              key={editData.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setEditData(null)}>
                <div className='form'>

                  <form encType="multipart/form-data" onSubmit={updateData} autoComplete='off'>


                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Title</label>
                      <input type="text" className="form-control" name='title'onChange={oneditChange} value={editData.title || ''} required />

                    </div>
                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Description</label>
                      <input type="text" className="form-control" name='desc' onChange={oneditChange} value={editData.desc || ''} required />

                    </div>
                    <div className="mb-3 times">
                   <div> <input type="text" className="form-control" name='fajr' placeholder='farj' onChange={oneditChange} value={editData.fajr || ''} required /></div>
                   <div><input type="text" className="form-control" name='dhuhr' placeholder='dhuhr' onChange={oneditChange} value={editData.dhuhr || ''} required /></div>
                    <div><input type="text" className="form-control" name='asr' placeholder='asr' onChange={oneditChange} value={editData.asr || ''} required /></div>
                    </div>
                    <div className="mb-3 times">
                   <div> <input type="text" className="form-control" name='magrib' placeholder='magrib' onChange={oneditChange} value={editData.magrib || ''} required /></div>
                   <div><input type="text" className="form-control" name='isha' placeholder='isha' onChange={oneditChange} value={editData.isha || ''} required /></div>
                    <div><input type="text" className="form-control" name='jummah' placeholder='jummah' onChange={oneditChange} value={editData.jummah || ''} required /></div>
                    </div>
                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Rating</label>
                      <select name='rating'  onChange={oneditChange} required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>

                    </div>


                    <button className="btn btn-primary" type="submit">
                     update
                    </button>
            
                  </form>
                </div>

              </Popup></>
      )}
           {newPlace&& (
        <><Marker draggable pickable="true" longitude={newPlace.long} latitude={newPlace.lat} anchor="bottom">
              <LocationOnIcon style={{ color: "blue", cursor: "pinter", fontSize: 7 * viewport.zoom }}  />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              key={newPlace.lat}
              anchor="top"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}>
                <div className='form'>

                  <form encType="multipart/form-data" onSubmit={handleSubmit} autoComplete='off'>


                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Title</label>
                      <input type="text" className="form-control" name='name' onChange={(e) => settitle(e.target.value)} value={title || ''} required />

                    </div>
                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Description</label>
                      <input type="text" className="form-control" name='email' onChange={(e) => setdesc(e.target.value)} value={desc || ''} required />

                    </div>
                    <div className="mb-3 times">
                   <div> <input type="text" className="form-control" name='email' placeholder='farj' onChange={(e) => setfajr(e.target.value)} value={fajr || ''} required /></div>
                   <div><input type="text" className="form-control" name='email' placeholder='dhuhr' onChange={(e) => setdhuhr(e.target.value)} value={dhuhr || ''} required /></div>
                    <div><input type="text" className="form-control" name='email' placeholder='asr' onChange={(e) => setasr(e.target.value)} value={asr || ''} required /></div>
                    </div>
                    <div className="mb-3 times">
                   <div> <input type="text" className="form-control" name='email' placeholder='magrib' onChange={(e) => setmagrib(e.target.value)} value={magrib || ''} required /></div>
                   <div><input type="text" className="form-control" name='email' placeholder='isha' onChange={(e) => setisha(e.target.value)} value={isha || ''} required /></div>
                    <div><input type="text" className="form-control" name='email' placeholder='jummah' onChange={(e) => setjummah(e.target.value)} value={jummah || ''} required /></div>
                    </div>
                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">Rating</label>
                      <select onChange={(e) => setrating(e.target.value)} required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>

                    </div>


                    <button className="btn btn-primary" type="submit">
                      Add mosque
                    </button>
            
                  </form>
                </div>

              </Popup></>
      )}
<div className='buttons'>
  {!currentusernamme?<><button className='btn btn-primary' onClick={registerclick}>Register</button>
<button  className='btn btn-primary'onClick={loginclick} >Login</button></>:<button onClick={logout} className='btn btn-warning'>Logout</button>}
  
</div>
{register&&<Register setregister={setregister} />}
{login&&<Login setCurrentUsername={setcurrentusernamme} setlogin={setlogin} />}
 </Map> }
       </div>
       
    )
}


export default Mapbox
