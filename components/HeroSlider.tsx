import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

const FALLBACK_IMAGE = require('../assets/hero-image.png');

const FALLBACK_SLIDES = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  },
];

interface HeroSlide {
  id: number;
  image_url?: string;
}

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayTimer, setAutoplayTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

  const { data: heroSlides = [], isLoading: slidesLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      try {
        const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE}/api/v1/hero-slides?active_only=true`);
        if (!response.ok) return FALLBACK_SLIDES;
        const data = await response.json();
        return data?.length > 0 ? data : FALLBACK_SLIDES;
      } catch {
        return FALLBACK_SLIDES;
      }
    },
  });

  const displaySlides = heroSlides?.length > 0 ? heroSlides : FALLBACK_SLIDES;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isUserScrolling.current && scrollViewRef.current && displaySlides.length > 0) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * width,
        animated: true,
      });
    }
  }, [currentIndex, displaySlides.length]);

  useEffect(() => {
    if (displaySlides.length === 0 || isUserScrolling.current) return;

    if (autoplayTimer) clearInterval(autoplayTimer);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, 5000);

    setAutoplayTimer(timer);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [displaySlides.length]);

  const handleDotPress = (index: number) => {
    isUserScrolling.current = true;
    setCurrentIndex(index);
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 100);
  };

  if (slidesLoading) {
    return (
      <View style={{ width, height: 200 }} className="flex items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#E05017" />
      </View>
    );
  }

  if (displaySlides.length === 0) {
    return null;
  }

  return (
    <View className="relative">
      {/* Carousel - Images Only */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width }}
        nestedScrollEnabled={true}
        onMomentumScrollEnd={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
          if (autoplayTimer) clearInterval(autoplayTimer);
        }}
        onScrollEndDrag={() => {
          isUserScrolling.current = false;
        }}
      >
        {displaySlides.map((slide: any, index: number) => (
          <View key={slide.id || index} style={{ width, height: 200 }}>
            <Image
              source={slide.image_url ? { uri: slide.image_url } : FALLBACK_IMAGE}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      {displaySlides.length > 1 && (
        <View className="flex-row justify-center items-center py-3 bg-gray-50">
          {displaySlides.map((_: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              className={`w-2 h-2 rounded-full mx-1.5 ${
                index === currentIndex ? 'bg-brand-orange' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
