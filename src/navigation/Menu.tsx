import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Animated, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from '@react-navigation/drawer';

import Screens from './Screens';
import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps,
) => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {isDark, handleIsDark} = useData();
  const [active, setActive] = useState('Home');
  const [inventoryExpanded, setInventoryExpanded] = useState(false);
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = colors.text;

  const handleNavigation = useCallback(
    (to: string) => {
      setActive(to);
      navigation.navigate('Screens', {screen: to});
    },
    [navigation, setActive],
  );

  const handleWebLink = useCallback((url: string) => Linking.openURL(url), []);

  // screen list for Drawer menu
  const screens = [
    {name: t('screens.home'), to: 'Home', icon: assets.home},
    {name: t('screens.components'), to: 'Components', icon: assets.components},
    {name: t('screens.articles'), to: 'Articles', icon: assets.document},
    {name: t('screens.rental'), to: 'Pro', icon: assets.rental},
    {name: t('screens.profile'), to: 'Profile', icon: assets.profile},
    {name: t('screens.settings'), to: 'Pro', icon: assets.settings},
    {name: t('screens.register'), to: 'Register', icon: assets.register},
    {name: t('screens.extra'), to: 'Pro', icon: assets.extras},
  ];

  // Inventory sub-items (expandable)
  const inventorySubItems = [
    {label: 'Items', to: 'InventoryListScreen', icon: 'cube-outline'},
    {label: 'Purchase Orders', to: 'PurchaseOrderScreen', icon: 'cart-outline'},
    {label: 'GRN', to: 'GRNScreen', icon: 'clipboard-outline'},
    {label: 'Stock Transfers', to: 'StockTransferScreen', icon: 'swap-horizontal-outline'},
    {label: 'Stock Audit', to: 'StockAuditScreen', icon: 'checkmark-done-outline'},
    {label: 'Reports', to: 'ReportsScreen', icon: 'bar-chart-outline'},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={33}
            color={colors.text}
            source={assets.logo}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold>
              {t('app.name')}
            </Text>
            <Text size={12} semibold>
              {t('app.native')}
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        {/* Inventory Section */}
        <Text semibold transform="uppercase" opacity={0.5}>
          {t('menu.documentation')}
        </Text>

        {/* Inventory expandable item */}
        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() => {
            handleNavigation('InventoryDashboardScreen');
            setInventoryExpanded(!inventoryExpanded);
          }}>
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients[inventoryExpanded ? 'primary' : 'white']}>
            <Ionicons
              name="medkit-outline"
              size={14}
              color={inventoryExpanded ? '#fff' : colors.black}
            />
          </Block>
          <Text p semibold={inventoryExpanded} color={labelColor} style={{flex: 1}}>
            Inventory
          </Text>
          <Ionicons
            name={inventoryExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={labelColor}
          />
        </Button>

        {/* Inventory sub-items */}
        {inventoryExpanded &&
          inventorySubItems.map((item, index) => {
            const isActive = active === item.to;
            return (
              <Button
                row
                justify="flex-start"
                marginBottom={sizes.s}
                key={`menu-inv-${item.to}-${index}`}
                onPress={() => handleNavigation(item.to)}
                style={{paddingLeft: sizes.sm}}>
                <Block
                  flex={0}
                  radius={6}
                  align="center"
                  justify="center"
                  width={sizes.md}
                  height={sizes.md}
                  marginRight={sizes.s}
                  gradient={gradients[isActive ? 'primary' : 'white']}>
                  <Ionicons
                    name={item.icon as any}
                    size={14}
                    color={isActive ? '#fff' : colors.black}
                  />
                </Block>
                <Text p semibold={isActive} color={labelColor}>
                  {item.label}
                </Text>
              </Button>
            );
          })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() =>
            handleWebLink('https://github.com/creativetimofficial')
          }>
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.white}>
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.black}
              source={assets.documentation}
            />
          </Block>
          <Text p color={labelColor}>
            {t('menu.started')}
          </Text>
        </Button>

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>{t('darkMode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => {
              handleIsDark(checked);
              Alert.alert(t('pro.title'), t('pro.alert'));
            }}
          />
        </Block>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  const {gradients} = useTheme();

  return (
    <Block gradient={gradients.light}>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            flex: 1,
            width: '60%',
            borderRightWidth: 0,
            backgroundColor: 'transparent',
          },
          drawerType: 'slide',
          overlayColor: 'transparent',
        }}
        drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Screens"
          component={ScreensStack}
          options={{
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </Block>
  );
};