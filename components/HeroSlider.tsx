import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const { width } = Dimensions.get('window');

const FALLBACK_IMAGE = require('../assets/hero-image.png');

interface HeroSlide {
  id: number;
  image_url?: string;
  localImage?: any;
  title: string;
  description: string;
}

export default function HeroSlider() {
  const router = useRouter();
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
        if (!response.ok) return [];
        return await response.json();
      } catch {
        return [];
      }
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const startAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % HERO_SLIDES.length;
        return nextIndex;
      });
    }, 5000);
    setAutoplayTimer(timer);
  };

  useEffect(() => {
    if (!isUserScrolling.current && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * width,
        animated: true,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
    };
  }, []);

  const handleDotPress = (index: number) => {
    isUserScrolling.current = true;
    setCurrentIndex(index);
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
    startAutoplay();
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 100);
  };

  const displaySlides = heroSlides.length > 0 ? heroSlides : [];

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
      {/* Slider */}
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
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
          if (autoplayTimer) clearInterval(autoplayTimer);
        }}
        onScrollEndDrag={() => {
          isUserScrolling.current = false;
          startAutoplay();
        }}
      >
        {displaySlides.map((slide: any, index: number) => (
          <View key={slide.id || index} style={{ width }} className="relative">
            {slide.image_url ? (
              <Image
                source={{ uri: slide.image_url }}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={FALLBACK_IMAGE}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
            )}

            {/* Gradient Overlay - Bottom to Top */}
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)', 'transparent']}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            />

            {/* Text Content */}
            <View className="absolute bottom-0 left-0 right-0 px-4 py-6">
              <Text
                style={{ fontFamily: 'Poppins_700Bold' }}
                className="text-white text-xl text-center mb-2"
                numberOfLines={2}
              >
                {slide.title}
              </Text>
              {slide.description && (
                <Text
                  style={{ fontFamily: 'Karla_400Regular' }}
                  className="text-white text-sm text-center"
                  numberOfLines={2}
                >
                  {slide.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View className="flex-row justify-center items-center py-3 bg-gray-50">
        {displaySlides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            className={`w-2 h-2 rounded-full mx-1.5 ${
              index === currentIndex ? 'bg-brand-orange' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
