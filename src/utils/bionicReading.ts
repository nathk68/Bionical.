export const convertToBionicReading = (text: string, isFileMode: boolean = false): string => {
    const words = text.split(' ');
    const limitedWords = isFileMode ? words : words.slice(0, 300);  // Limiter à 300 mots seulement si ce n'est pas en mode fichier
  
    return limitedWords.join(' ').split('\n').map(paragraph => {
      return paragraph.split(' ').map(word => {
        const midpoint = Math.ceil(word.length / 2);
        return `<b>${word.slice(0, midpoint)}</b>${word.slice(midpoint)}`;
      }).join(' ');
    }).join('<br>');
  };
  