import Icon from "@/assets/icons";
import Bell from "@/assets/icons/Bell";
import React, { useEffect, useState } from 'react';

import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { INews } from "@/helpers/types/api.types";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const news = [
  {
    id: 1,
    title: "Lancement du nouveau fond de subvention 2026",
    publication: "Publié le 30/12/2025",
    lecture: "5 min de lecture"
  },
  {
    id: 2,
    title: "Impact des subventions",
    publication: "Publié le 12/01/2026",
    lecture: "7 min de lecture"
  },
]

export default function Index() {
  const [newsData, setNewsData] = useState<INews[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

    // fetch all crasc data
    useEffect(() => {
      const fetchNewsData = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const response = await fetch("http://188.130.27.139:8000/api/v1/crasc/news?skip=0&limit=100");
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
          }
          const result = await response.json();
          setNewsData(result);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      fetchNewsData();
    }, []);

  return (
    <ScreenWrapper bg={theme.colors.white}>
      <StatusBar style='dark' />

      <View style={styles.container}>
        {/* Header */}
        <View style={{borderBottomWidth: .5, borderColor: theme.colors.darkGray, marginBottom: hp(2)}}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logo-crasc.png")}
              style={{ padding: hp(4) }}
            />
            {/* <Text style={styles.title}>PASCI</Text> */}
            <View style={styles.icons}>
              <Pressable>
                <Bell strokeWidth={1} />
              </Pressable>
            </View>
          </View>
        </View>
        
        <ScrollView>
          {/* Hero image */}
          <ImageBackground
            source={require('@/assets/images/hero.png')}
            style={styles.heroImage}
          >
            <Text style={styles.heroMainText}>Plateforme digitale des OSCs membres du CRASC</Text>
            <Text style={{color: theme.colors.white, fontFamily: "pRegular", padding: wp(1)}}>
              Cette Plateforme digitale est la résultante d'une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité.
            </Text>
            <Pressable style={{ padding: wp(2), backgroundColor: theme.colors.white, borderRadius: theme.radius.xl }}>
              <Text style={{fontFamily: "pMedium", color: theme.colors.orange}}>En savoir plus</Text>
            </Pressable>
          </ImageBackground>

          {/* Liens */}
          <View style={[styles.horizontalAlign, {marginBottom: hp(4), marginHorizontal: wp(4),}  ]}>
            <Pressable style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ backgroundColor: "#0678410D", padding: 10, borderRadius: theme.radius.sm }}>
                <Icon name="config" size={28} strokeWidth={1.6} color={theme.colors.green} />
              </View>
              
              <Text style={styles.linkText}>Services</Text>
            </Pressable>

            <Pressable style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ backgroundColor: "#0056b31a", padding: 10, borderRadius: theme.radius.sm }}>
                <Icon name="hat" size={28} />
              </View>
              
              <Text style={styles.linkText}>Formations</Text>
            </Pressable>
            
            <Pressable style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ backgroundColor: "#FFEDD5", padding: 10, borderRadius: theme.radius.sm }}>
                <Icon name="userGroup" size={28} />
              </View>
              
              <Text style={styles.linkText}>Annuaire</Text>
            </Pressable>
            
            <Pressable style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ backgroundColor: "#F3E8FF", padding: 10, borderRadius: theme.radius.sm }}>
                <Icon name="file" size={28} />
              </View>
              
              <Text style={styles.linkText}>Ressources</Text>
            </Pressable>
          </View>

          {/* Actualités récentes */}
          <View style={[{marginBottom: hp(4), marginHorizontal: wp(4)}]}>
            <View style={styles.horizontalAlign }>
              <Text style={{fontFamily: "pBold", fontSize: 20}}>Actualités</Text>
              <Pressable>
                <Text style={{fontFamily:"pMedium", color: theme.colors.orange}}>Voir tout</Text>
              </Pressable>
            </View>
            <FlatList
              data={newsData}
              horizontal={true}
              renderItem={({ item }) => (
                <View style={[ { gap: wp(2), paddingRight: 30 } ]}>
                  <Text style={{ fontFamily: "pMedium" }}>{item.title}</Text>
                </View>
              )}
            />
          </View>

          {/* Ressource à la une */}
          <View style={{ marginBottom: hp(4), marginHorizontal: wp(4) }}>
            <Text style={{fontFamily: "pBold", fontSize: 20}}>Ressources</Text>
          </View>

          {/* Stats */}
          <View style={[ styles.horizontalAlign, styles.stats, {marginBottom: hp(4)} ]}>
            <View style={styles.statsText}>
              <Text style={{ fontSize: 35, color: "#067841", fontFamily: "pBold" }}>150+</Text>
              <Text style={{ textTransform: "uppercase", fontFamily: "pRegular", fontSize: wp(3.5), color: theme.colors.textLight }}>osc accompagnées</Text>
            </View>

            <View style={styles.statsText}>
              <Text style={{ fontSize: 35, color: "#0056b3", fontFamily: "pBold" }}>24</Text>
              <Text style={{ textTransform: "uppercase", fontFamily: "pRegular", fontSize: wp(3.5), color: theme.colors.textLight }}>régions couvertes</Text>
            </View>
          </View>
        </ScrollView>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    //backgroundColor: "red"
  },
  title: {
    color: theme.colors.green,
    fontSize: hp(3.2),
    fontFamily: "pBold"
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18
  },
  heroImage: {
    height: 300,
    justifyContent: 'center', // Centers text vertically
    alignItems: 'flex-start',     // Centers text horizontally
    paddingHorizontal: wp(4),
    borderCurve: "continuous",
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    resizeMode: "cover",
    marginHorizontal: wp(4),
    marginBottom: hp(4)
  },
  heroMainText: {
    color: 'white',
    fontSize: 24,
    fontFamily: "pBold"
  },
  horizontalAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
  },
  linkText: {
    //fontWeight: "bold",
    fontFamily: "pMedium",
    color: theme.colors.textDark
  },
  stats: {
    padding: wp(4),
    marginHorizontal: wp(4),
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: "#0678411A",
    backgroundColor: "#0678410D",
    gap: wp(6),
  },
  statsText: {
    justifyContent: "center",
    alignItems: "center",
  }
})