import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export interface ICrasc {
  id: string;
  name: string;
  slug: string;
  osc_count: number;
  
  //description
  //oscs
  //regions
  //news
}

interface INews {
  title: string;
  content: string;
  crasc: ICrasc
}

export default function JobsScreen() {
  const [crascData, setCrascData] = useState<INews[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //
  }, []);
  // fetch all crasc data
  useEffect(() => {
    const fetchCrascData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://188.130.27.139:8000/api/v1/crasc/news?skip=0&limit=100");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        setCrascData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrascData();
  }, []);
  

  return (
    <ScreenWrapper bg="white">
      <Text style={{fontFamily: "pBold", fontSize: 20}}>Actualités</Text>
      <ScrollView>
        {crascData?.map((item) => (
          <View key={item.title}>
             <Text>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  )
}