import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { WasteSpot } from '../types';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

interface MapViewProps {
  spots: WasteSpot[];
  onMarkerClick: (spot: WasteSpot) => void;
}

export default function MapView({ spots, onMarkerClick }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  if (!isLoaded) return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center font-bold text-gray-400">LOADING MAP...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        styles: [
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={{ lat: spot.latitude, lng: spot.longitude }}
          onClick={() => onMarkerClick(spot)}
          icon={{
            url: spot.status === 'cleaned' ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
        />
      ))}
    </GoogleMap>
  );
}
