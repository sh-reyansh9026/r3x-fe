import React from 'react';
import { Text, TextProps, StyleProp, TextStyle, Platform } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  weight?: 'regular' | 'medium' | 'bold' | 'light' | 'thin' | 'black' | 'semiBold' | 'extraBold';
}

export default function CustomText({ 
  children, 
  style, 
  weight = 'regular',
  ...props 
}: CustomTextProps) {
  const fontWeights = {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    bold: 'DMSans-Bold',
    light: 'DMSans-Light',
    thin: 'DMSans-Thin',
    black: 'DMSans-Black',
    semiBold: 'DMSans-SemiBold',
    extraBold: 'DMSans-ExtraBold',
  };

  const fontFamily = fontWeights[weight] || fontWeights.regular;

  return (
    <Text 
      {...props} 
      style={[{
        fontFamily,
        // Fallback to system font if custom font fails to load
        ...(Platform.OS === 'ios' ? {} : { fontFamily: fontFamily })
      }, style]}
    >
      {children}
    </Text>
  );
}