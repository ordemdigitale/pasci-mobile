import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Télécharge un fichier et propose de l'ouvrir ou de le partager
 * @param url URL du fichier à télécharger
 * @param fileName Nom du fichier (avec extension)
 */
export const downloadAndOpenDocument = async (
  url: string, 
  fileName: string, 
  onProgress?: (progress: number) => void
) => {
  if (!url) {
    Alert.alert('Erreur', 'URL du document invalide');
    return;
  }

  try {
    const cleanUrl = url.trim();
    const safeFileName = fileName.replace(/\./g, '_').replace(/_pdf$/, '.pdf');
    const fileUri = `${FileSystem.cacheDirectory}${safeFileName}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      cleanUrl,
      fileUri,
      {},
      (downloadProgress) => {
        if (onProgress) {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          onProgress(progress || 0);
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    
    if (!result || !result.uri) {
      throw new Error('Échec du téléchargement');
    }

    // 2. Vérifier si le partage est possible (et l'ouverture)
    const canShare = await Sharing.isAvailableAsync();
    
    if (canShare) {
      await Sharing.shareAsync(result.uri, {
        mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : undefined,
        dialogTitle: `Ouvrir ${fileName}`,
        UTI: fileName.endsWith('.pdf') ? 'com.adobe.pdf' : undefined,
      });
    } else {
      Alert.alert('Succès', 'Document téléchargé mais le partage n\'est pas disponible.');
    }

  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    // Affichage d'un message plus explicite à l'utilisateur
    Alert.alert('Téléchargement', 'Impossible de récupérer le document. Veuillez réessayer plus tard.');
  }
};
