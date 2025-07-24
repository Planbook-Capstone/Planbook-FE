import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value,
  size = 200,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'M',
  className = ''
}) => {
  return (
    <div className={`inline-block p-4 bg-white rounded-lg border ${className}`}>
      <QRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
      />
    </div>
  );
};

export default QRCodeComponent;
