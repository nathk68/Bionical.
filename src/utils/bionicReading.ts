import { TextRun } from "docx";

export const convertToBionicReading = (text: string): string => {
  const words = text.split(' ');
  return words.map(word => {
      const midpoint = Math.ceil(word.length / 2);
      return `<b>${word.slice(0, midpoint)}</b>${word.slice(midpoint)}`;
  }).join(' ');
};

export const convertToBionicReadingForDocx = (text: string): TextRun[] => {
  return text.split(' ').flatMap((word, index, array) => {
    const midpoint = Math.ceil(word.length / 2);
    const boldPart = new TextRun({ text: word.slice(0, midpoint), bold: true });
    const normalPart = new TextRun({ text: word.slice(midpoint) });
    const space = index < array.length - 1 ? new TextRun({ text: ' ' }) : null;
    return space ? [boldPart, normalPart, space] : [boldPart, normalPart];
});
};
