import React, { useRef, useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles/styles.js';
import theme from './styles/theme.js';

type Props = React.ComponentProps<typeof TextInput> & {
  label: string,
  value: string,
  iconName: string,
  iconSize: number,
}

const TextField: React.FC<Props> = (props) => {
  const { label, value, iconName, iconSize, style, onBlur, onFocus, ...restOfProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnimation, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 100,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start()
  }, [focusAnimation, isFocused, value])

  return (
    <Animated.View style={[style, styles.inputContainer, {
      borderColor: focusAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.md_sys_color_outline, theme.md_sys_color_on_tertiary_container],
      }),
    }]}>
        <View style={styles.iconContainer}>
            <AntDesign name={iconName} size={iconSize} color={isFocused ? theme.md_sys_color_on_tertiary_container : theme.md_sys_color_outline}/>
        </View>

        <Animated.View style={[inputStyle.inputContainer, {
          top: focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [9, -15],
          }),
          left: focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 46],
          }),
          opacity: focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        }]}>
            <Text style={[inputStyle.label, {
              fontSize: isFocused ? 14 : 16,
              opacity: isFocused ? 1 : 0.5,
            }]}>{label}</Text>
        </Animated.View>

        <TextInput
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}

            value={value}

            style={[styles.input]}
            {...restOfProps}
        />
    </Animated.View>
  );
};

const inputStyle = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    padding: 2,
    justifyContent: "center",
    backgroundColor: theme.md_sys_color_background,
  },
  unselectedContainer: {
    left: 50,
    top: 10,
  },
  selectedContainer: {
    left: 46,
    top: -12,
  },
  label: {
    color: theme.md_sys_color_on_tertiary_container,
  },
  unselected: {
    fontSize: 16,
    opacity: 0.7,
  },
  selected: {
    fontSize: 14,
    color: theme.md_sys_color_on_tertiary_container,
  },
});

export default TextField;
