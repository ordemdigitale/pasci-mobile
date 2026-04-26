import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const HERO_SLIDES = [
  {
    id: 1,
    image: require('../assets/hero-image.png'),
    title: 'Plateforme Digitale',
    description: 'PDOC',
    action: null,
  },
  {
    id: 2,
    image: require('../assets/images/service-hero.jpg'),
    title: 'Nos Services',
    description: 'Découvrez',
    action: { route: '/services', label: 'Voir' },
  },
  {
    id: 3,
    image: require('../assets/hero-image.png'),
    title: 'Soutenir PDOC',
    description: 'Faire un don',
    action: { route: '/faire-un-don', label: 'Donner' },
  },
];

interface HeroSlide {
  id: number;
  image: any;
  title: string;
  description: string;
  action: { route: string; label: string } | null;
}

export default function HeroSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayTimer, setAutoplayTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

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
        {HERO_SLIDES.map((slide: HeroSlide) => (
          <View key={slide.id} style={{ width }} className="relative">
            <Image
              source={slide.image}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />

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
                className="text-white text-2xl text-center mb-2"
              >
                {slide.title}
              </Text>
              <Text
                style={{ fontFamily: 'Karla_400Regular' }}
                className="text-white text-sm text-center mb-4"
              >
                {slide.description}
              </Text>
              {slide.action && (
                <TouchableOpacity
                  onPress={() => router.push(slide.action!.route)}
                  className="bg-brand-orange px-6 py-2 rounded-full self-center"
                >
                  <Text
                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                    className="text-white text-xs"
                  >
                    {slide.action.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View className="flex-row justify-center items-center py-3 bg-gray-50">
        {HERO_SLIDES.map((_, index) => (
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
