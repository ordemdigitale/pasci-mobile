import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const mapImage = require('../assets/images/crasc-map.png');

// Zones de toucher en % de l'image (535x555)
// left, top, width, height
const REGIONS = [
  { id: 'nord',   name: 'CRASC NORD',   zone: { l: 9,  t: 2,  w: 59, h: 46 } },
  { id: 'est',    name: 'CRASC EST',    zone: { l: 64, t: 11, w: 36, h: 57 } },
  { id: 'centre', name: 'CRASC CENTRE', zone: { l: 36, t: 35, w: 33, h: 40 } },
  { id: 'ouest',  name: 'CRASC OUEST',  zone: { l: 0,  t: 35, w: 45, h: 53 } },
  { id: 'sud',    name: 'CRASC SUD',    zone: { l: 8,  t: 71, w: 83, h: 29 } },
];

interface Region {
  id: string;
  name: string;
}

interface Props {
  onRegionPress?: (region: Region) => void;
}

export default function CrascMap({ onRegionPress }: Props) {
  const handlePress = (region: Region) => {
    if (onRegionPress) {
      onRegionPress(region);
    }
  };

  return (
    <View style={{ width: '100%', aspectRatio: 535 / 555 }}>
      <Image
        source={mapImage}
        style={{ width: '100%', height: '100%' }}
        resizeMode="stretch"
      />
      {REGIONS.map((region) => (
        <TouchableOpacity
          key={region.id}
          onPress={() => handlePress(region)}
          activeOpacity={0.2}
          style={{
            position: 'absolute',
            left: `${region.zone.l}%`,
            top: `${region.zone.t}%`,
            width: `${region.zone.w}%`,
            height: `${region.zone.h}%`,
          }}
        />
      ))}
    </View>
  );
}
