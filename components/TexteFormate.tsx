import React from 'react';
import { View, Text } from 'react-native';

/**
 * Texte modifiable dans l'admin du site (Textes et illustrations), même format que le web :
 * ligne vide = paragraphe, « ## » = intertitre, « - » = puce, **gras**, {variable}.
 */
function enLigne(texte: string, variables: Record<string, string | number>) {
  const remplace = texte.replace(/\{(\w+)\}/g, (m, nom) => (nom in variables ? String(variables[nom]) : m));
  return remplace.split(/(\*\*[^*]+\*\*)/g).map((morceau, i) =>
    morceau.startsWith('**') && morceau.endsWith('**') ? (
      <Text key={i} style={{ fontFamily: 'Karla_700Bold' }}>{morceau.slice(2, -2)}</Text>
    ) : (
      morceau
    ),
  );
}

export default function TexteFormate({
  texte,
  variables = {},
}: {
  texte: string;
  variables?: Record<string, string | number>;
}) {
  const blocs: React.ReactNode[] = [];
  let paragraphe: string[] = [];
  const style = { fontFamily: 'Karla_400Regular' };
  const viderParagraphe = (cle: string) => {
    if (paragraphe.length) {
      blocs.push(
        <Text key={cle} style={style} className="text-gray-600 text-sm leading-5 mb-2">
          {enLigne(paragraphe.join(' '), variables)}
        </Text>,
      );
      paragraphe = [];
    }
  };
  texte.split(/\r?\n/).forEach((ligne, i) => {
    const l = ligne.trim();
    if (!l) return viderParagraphe(`p${i}`);
    if (l.startsWith('## ')) {
      viderParagraphe(`p${i}`);
      blocs.push(
        <Text key={`h${i}`} style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mt-2 mb-1">
          {enLigne(l.slice(3), variables)}
        </Text>,
      );
    } else if (l.startsWith('- ')) {
      viderParagraphe(`p${i}`);
      blocs.push(
        <View key={`u${i}`} className="flex-row mb-1 pl-1">
          <Text style={style} className="text-gray-600 text-sm mr-2">•</Text>
          <Text style={style} className="text-gray-600 text-sm leading-5 flex-1">{enLigne(l.slice(2), variables)}</Text>
        </View>,
      );
    } else {
      paragraphe.push(l);
    }
  });
  viderParagraphe('fin');
  return <View>{blocs}</View>;
}
