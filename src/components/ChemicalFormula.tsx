import React from 'react';

interface ChemicalFormulaProps {
  formula: string;
}

const ChemicalFormula: React.FC<ChemicalFormulaProps> = ({ formula }) => {
  // Parse formula and convert subscript notation
  const parseFormula = (text: string) => {
    // Replace <sub>...</sub> with actual subscript
    return text.replace(/<sub>(.*?)<\/sub>/g, (match, content) => {
      return content;
    });
  };

  // Split text and identify subscript, superscript and bold parts
  const renderFormula = (text: string) => {
    // Split by <sub>, <sup> and <b> tags
    const parts = text.split(/(<sub>.*?<\/sub>|<sup>.*?<\/sup>|<b>.*?<\/b>)/g);

    return parts.map((part, index) => {
      if (part.match(/<sub>(.*?)<\/sub>/)) {
        const content = part.replace(/<sub>(.*?)<\/sub>/, '$1');
        return <sub key={index}>{content}</sub>;
      }
      if (part.match(/<sup>(.*?)<\/sup>/)) {
        const content = part.replace(/<sup>(.*?)<\/sup>/, '$1');
        return <sup key={index}>{content}</sup>;
      }
      if (part.match(/<b>(.*?)<\/b>/)) {
        const content = part.replace(/<b>(.*?)<\/b>/, '$1');
        return <b key={index}>{content}</b>;
      }
      return part;
    });
  };

  return <span>{renderFormula(formula)}</span>;
};

export default ChemicalFormula;
