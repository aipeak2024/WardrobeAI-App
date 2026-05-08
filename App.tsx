import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const palette = {
  background: '#F8F2EA',
  surface: '#FFFDF9',
  surfaceAlt: '#EFE2D3',
  text: '#2D2926',
  muted: '#8A7B6C',
  accent: '#9C7A5B',
  accentDark: '#6F533C',
  border: '#E7D9CA',
};

type TabKey = 'home' | 'closet' | 'stylist' | 'market' | 'profile';

type TabItem = {
  key: TabKey;
  label: string;
  title: string;
  icon: string;
};

const tabs: TabItem[] = [
  { key: 'home', label: 'Home', title: 'Dashboard', icon: '⌂' },
  { key: 'closet', label: 'My Closet', title: 'My Closet', icon: '♢' },
  { key: 'stylist', label: 'AI Stylist', title: 'AI Stylist', icon: '✦' },
  { key: 'market', label: 'Market', title: 'Market', icon: '□' },
  { key: 'profile', label: 'Profile', title: 'Profile', icon: '○' },
];

const clothingItems = [
  { id: '1', name: 'Cream Knit', category: 'Sweater', color: '#E8DDCF' },
  { id: '2', name: 'Linen Shirt', category: 'Top', color: '#F5EEE6' },
  { id: '3', name: 'Camel Coat', category: 'Outerwear', color: '#C9A37A' },
  { id: '4', name: 'Soft Trousers', category: 'Bottoms', color: '#D8C6B4' },
  { id: '5', name: 'Silk Scarf', category: 'Accessory', color: '#EAD3C3' },
  { id: '6', name: 'Taupe Flats', category: 'Shoes', color: '#BCA892' },
];

export default function App() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('closet');
  const { width } = useWindowDimensions();
  const columns = width >= 720 ? 3 : 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <Header activeTab={activeTab} />
        <View style={styles.content}>{activeTab === 'closet' ? <ClosetGrid columns={columns} /> : <ComingSoon tab={activeTab} />}</View>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'closet' && (
          <Pressable style={styles.fab} accessibilityRole="button" accessibilityLabel="Add clothing item">
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function Header({ activeTab }: { activeTab: TabKey }) {
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[1];

  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>WardrobeAI</Text>
      <Text style={styles.title}>{currentTab.title}</Text>
      <Text style={styles.subtitle}>Curate, style, and rediscover your wardrobe with calm confidence.</Text>
    </View>
  );
}

function ClosetGrid({ columns }: { columns: number }) {
  return (
    <FlatList
      key={columns}
      data={clothingItems}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.gridRow}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recently added</Text>
            <Text style={styles.sectionSubtitle}>6 pieces ready to style</Text>
          </View>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterIcon}>☰</Text>
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={[styles.placeholder, { backgroundColor: item.color }]}>
            <View style={styles.hangerLine} />
            <Text style={styles.placeholderIcon}>◇</Text>
          </View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
      )}
    />
  );
}

function ComingSoon({ tab }: { tab: TabKey }) {
  const currentTab = tabs.find((item) => item.key === tab) ?? tabs[0];

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>{currentTab.icon}</Text>
      </View>
      <Text style={styles.emptyTitle}>{currentTab.title}</Text>
      <Text style={styles.emptyText}>This space is ready for the next WardrobeAI feature.</Text>
    </View>
  );
}

function BottomNavigation({ activeTab, onTabChange }: { activeTab: TabKey; onTabChange: (tab: TabKey) => void }) {
  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable key={tab.key} style={styles.navItem} onPress={() => onTabChange(tab.key)}>
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
            {isActive && <View style={styles.activeDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 112,
  },
  gridRow: {
    gap: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 3,
  },
  filterPill: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterIcon: {
    color: palette.accentDark,
    fontSize: 15,
    fontWeight: '700',
  },
  filterText: {
    color: palette.accentDark,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    flex: 1,
    padding: 6,
  },
  placeholder: {
    alignItems: 'center',
    aspectRatio: 0.82,
    borderColor: 'rgba(111, 83, 60, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    shadowColor: '#7C6048',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  hangerLine: {
    backgroundColor: 'rgba(111, 83, 60, 0.18)',
    borderRadius: 999,
    height: 2,
    marginBottom: 10,
    width: 44,
  },
  placeholderIcon: {
    color: palette.accentDark,
    fontSize: 34,
  },
  itemName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  itemCategory: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 2,
  },
  navBar: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingBottom: 12,
    paddingHorizontal: 6,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  navIcon: {
    color: palette.muted,
    fontSize: 21,
    fontWeight: '700',
  },
  navIconActive: {
    color: palette.accentDark,
  },
  navLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelActive: {
    color: palette.accentDark,
  },
  activeDot: {
    backgroundColor: palette.accentDark,
    borderRadius: 999,
    height: 4,
    marginTop: 5,
    width: 18,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: palette.accentDark,
    borderRadius: 999,
    bottom: 94,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#4C3526',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    width: 60,
  },
  fabIcon: {
    color: palette.surface,
    fontSize: 34,
    lineHeight: 38,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: palette.surfaceAlt,
    borderRadius: 28,
    height: 72,
    justifyContent: 'center',
    marginBottom: 18,
    width: 72,
  },
  emptyIconText: {
    color: palette.accentDark,
    fontSize: 34,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
});
