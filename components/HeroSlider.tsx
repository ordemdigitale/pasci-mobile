import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Image, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

const FALLBACK_IMAGE = require('../assets/hero-image.png');

const FALLBACK_TITLE = "Centre Régional d'Appui à la Société Civile - CRASC";
const FALLBACK_DESCRIPTION = "Cette Plateforme digitale est la résultante d'une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité.";

const DEFAULT_SLIDE_TEXTS = [
  {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  },
  {
    title: "Renforcer la visibilité des OSC",
    description: "Valorisez les initiatives, les expériences et les actions portées par les organisations de la société civile.",
  },
  {
    title: "Partager les opportunités",
    description: "Retrouvez les informations utiles pour les formations, appels à projets, emplois et activités des CRASC.",
  },
  {
    title: "Créer une synergie d'action",
    description: "Facilitez la collaboration entre OSC, CRASC et partenaires pour des actions mieux coordonnées.",
  },
  {
    title: "Découvrir les CRASC",
    description: "Identifiez les centres régionaux et les organisations qui agissent dans chaque zone.",
  },
];

const FALLBACK_SLIDES = [
  {
    id: 1,
    image_url: 'https://api.plateforme-osci.org/static/9057d4a1-531d-4e15-a82c-850215270748.jpeg',
  },
  {
    id: 2,
    image_url: 'https://api.plateforme-osci.org/static/12118406-2ecf-4191-b8e1-32384e93d71f.jpeg',
  },
  {
    id: 3,
    image_url: 'https://api.plateforme-osci.org/static/e2cd0c47-7089-4215-81dc-44f557bfb0c6.jpg',
  },
  {
    id: 4,
    image_url: 'https://api.plateforme-osci.org/static/3432bddc-5ea1-4430-a30a-953af6b1ee8f.jpeg',
  },
  {
    id: 5,
    image_url: 'https://api.plateforme-osci.org/static/1beda0d2-214e-4e7d-be46-901dcac176b9.jpeg',
  },
  {
    id: 6,
    image_url: 'https://api.plateforme-osci.org/static/dc64e767-c52d-4a92-8194-45ce8a5111be.jpeg',
  },
  {
    id: 7,
    image_url: 'https://api.plateforme-osci.org/static/b5ea6f5f-5916-4434-b510-2e41472a9626.jpeg',
  },
  {
    id: 8,
    image_url: 'https://api.plateforme-osci.org/static/9f9cbcf3-b269-4adc-a0e8-e6bdaf9d3a72.jpg',
  },
];

interface HeroSlide {
  id: number;
  image_url?: string;
  title?: string | null;
  description?: string | null;
}

type NormalizedHeroSlide = {
  id: number;
  image_url?: string;
  title: string;
  description: string;
};

type HeroSliderProps = {
  onSlideChange?: (slide: NormalizedHeroSlide) => void;
};

const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL || 'https://api.plateforme-osci.org')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');

function getImageUri(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

function normalizeSlide(slide: HeroSlide, index: number): NormalizedHeroSlide {
  const fallbackText = DEFAULT_SLIDE_TEXTS[index % DEFAULT_SLIDE_TEXTS.length];
  return {
    id: slide.id || index + 1,
    image_url: slide.image_url,
    title: slide.title || fallbackText.title,
    description: slide.description || fallbackText.description,
  };
}

export default function HeroSlider({ onSlideChange }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayTimer, setAutoplayTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

  const { data: heroSlides = [], isLoading: slidesLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_ORIGIN}/api/v1/hero-slides?active_only=true&type=haut`);
        if (!response.ok) return FALLBACK_SLIDES;
        const data = await response.json();
        return data?.length > 0 ? data : FALLBACK_SLIDES;
      } catch {
        return FALLBACK_SLIDES;
      }
    },
  });

  const displaySlides = useMemo(
    () => (heroSlides?.length > 0 ? heroSlides : FALLBACK_SLIDES).map(normalizeSlide),
    [heroSlides]
  );

  useEffect(() => {
    if (displaySlides.length > 0 && currentIndex >= displaySlides.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displaySlides.length]);

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
    const currentSlide = displaySlides[currentIndex];
    if (currentSlide) onSlideChange?.(currentSlide);
  }, [currentIndex, displaySlides, onSlideChange]);

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
              source={slide.image_url ? { uri: getImageUri(slide.image_url) } : FALLBACK_IMAGE}
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
