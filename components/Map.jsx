import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import LoadingFallback from './LoadingFallback';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
  });
  const [location, seTlocation] = useState({})
  if (loadError) {
    return <div className='text-red-400'>Error loading map, check internet connectivity</div>;
  }

  if (!isLoaded) {
    return <LoadingFallback />;
  }

  return (
    <div>
    <div className='w-[310px] h-[450px] md:w-[450px] md:h-[500px] lg:w-[520px]'>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} draggable/>
      </GoogleMap>
    </div>
    </div>
  );
};

export default Map;