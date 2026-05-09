import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  sell: '#B65A3C',
  sellDark: '#8F3E27',
  success: '#4E7C61',
};

type TabKey = 'home' | 'closet' | 'stylist' | 'market' | 'profile';

type TabItem = {
  key: TabKey;
  label: string;
  title: string;
  icon: string;
};

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  brand: string;
  condition: string;
  estimatedPrice: string;
};

type MarketItem = {
  id: string;
  name: string;
  brand: string;
  price: string;
  color: string;
  condition: string;
};

const tabs: TabItem[] = [
  { key: 'home', label: 'Home', title: 'Dashboard', icon: '⌂' },
  { key: 'closet', label: 'My Closet', title: 'My Closet', icon: '♢' },
  { key: 'stylist', label: 'AI Stylist', title: 'AI Stylist', icon: '✦' },
  { key: 'market', label: 'Market', title: 'Market', icon: '□' },
  { key: 'profile', label: 'Profile', title: 'Profile', icon: '○' },
];

const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Cream Knit',
    category: 'Sweater',
    color: '#E8DDCF',
    brand: 'Atelier Muse',
    condition: 'Excellent',
    estimatedPrice: '$58',
  },
  {
    id: '2',
    name: 'Linen Shirt',
    category: 'Top',
    color: '#F5EEE6',
    brand: 'Everlane',
    condition: 'Very good',
    estimatedPrice: '$42',
  },
  {
    id: '3',
    name: 'Camel Coat',
    category: 'Outerwear',
    color: '#C9A37A',
    brand: 'Cuyana',
    condition: 'Excellent',
    estimatedPrice: '$128',
  },
  {
    id: '4',
    name: 'Soft Trousers',
    category: 'Bottoms',
    color: '#D8C6B4',
    brand: 'Aritzia',
    condition: 'Good',
    estimatedPrice: '$64',
  },
  {
    id: '5',
    name: 'Silk Scarf',
    category: 'Accessory',
    color: '#EAD3C3',
    brand: 'Vintage',
    condition: 'Excellent',
    estimatedPrice: '$36',
  },
  {
    id: '6',
    name: 'Taupe Flats',
    category: 'Shoes',
    color: '#BCA892',
    brand: 'Margaux',
    condition: 'Very good',
    estimatedPrice: '$74',
  },
];

const marketItems: MarketItem[] = [
  { id: 'm1', name: 'Cashmere Crew', brand: 'Naadam', price: '$72', color: '#DCCDBB', condition: 'Excellent' },
  { id: 'm2', name: 'Silk Button-Up', brand: 'Equipment', price: '$54', color: '#F2E8D9', condition: 'Very good' },
  { id: 'm3', name: 'Wool Wrap Coat', brand: 'Cuyana', price: '$148', color: '#B88E65', condition: 'Excellent' },
  { id: 'm4', name: 'Pleated Trouser', brand: 'Aritzia', price: '$68', color: '#D4C0AA', condition: 'Good' },
  { id: 'm5', name: 'Minimal Loafer', brand: 'Vagabond', price: '$86', color: '#A9937E', condition: 'Very good' },
  { id: 'm6', name: 'Satin Midi Skirt', brand: 'Reformation', price: '$78', color: '#E7C7B6', condition: 'Excellent' },
];

export default function App() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('closet');
  const [isUploadVisible, setUploadVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ClothingItem | null>(null);
  const [isSellSuccessVisible, setSellSuccessVisible] = React.useState(false);
  const { width } = useWindowDimensions();
  const columns = width >= 720 ? 3 : 2;

  const handleSellItem = () => {
    setSelectedItem(null);
    setSellSuccessVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <Header activeTab={activeTab} />
        <View style={styles.content}>
          {activeTab === 'closet' && <ClosetGrid columns={columns} onItemPress={setSelectedItem} />}
          {activeTab === 'market' && <MarketScreen columns={columns} />}
          {activeTab !== 'closet' && activeTab !== 'market' && <ComingSoon tab={activeTab} />}
        </View>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'closet' && (
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            accessibilityRole="button"
            accessibilityLabel="Add clothing item"
            onPress={() => setUploadVisible(true)}
            hitSlop={12}
          >
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>
        )}
        <UploadItemModal visible={isUploadVisible} onClose={() => setUploadVisible(false)} />
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} onSell={handleSellItem} />
        <SellSuccessModal visible={isSellSuccessVisible} onClose={() => setSellSuccessVisible(false)} />
      </View>
    </SafeAreaView>
  );
}

function Header({ activeTab }: { activeTab: TabKey }) {
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[1];
  const subtitle =
    activeTab === 'market'
      ? 'Discover premium secondhand pieces and list your wardrobe in a tap.'
      : 'Curate, style, and rediscover your wardrobe with calm confidence.';

  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>WardrobeAI</Text>
      <Text style={styles.title}>{currentTab.title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

function ClosetGrid({
  columns,
  onItemPress,
}: {
  columns: number;
  onItemPress: (item: ClothingItem) => void;
}) {
  return (
    <FlatList
      key={`closet-${columns}`}
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
            <Text style={styles.sectionSubtitle}>6 pieces ready to style or sell</Text>
          </View>
          <Pressable style={styles.filterPill} accessibilityRole="button" accessibilityLabel="Filter closet items">
            <Text style={styles.filterIcon}>☰</Text>
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => <ClosetItemCard item={item} onPress={() => onItemPress(item)} />}
    />
  );
}

function ClosetItemCard({ item, onPress }: { item: ClothingItem; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name} details`}
      onPress={onPress}
    >
      <View style={[styles.placeholder, { backgroundColor: item.color }]}>
        <View style={styles.hangerLine} />
        <Text style={styles.placeholderIcon}>◇</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCategory}>{item.category}</Text>
    </Pressable>
  );
}

function MarketScreen({ columns }: { columns: number }) {
  return (
    <FlatList
      key={`market-${columns}`}
      data={marketItems}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.gridRow}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.marketHero}>
          <View>
            <Text style={styles.marketEyebrow}>Curated drops</Text>
            <Text style={styles.marketTitle}>Premium thrift, instantly shoppable.</Text>
          </View>
          <View style={styles.marketBadge}>
            <Text style={styles.marketBadgeText}>8% seller fee</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => <MarketItemCard item={item} />}
    />
  );
}

function MarketItemCard({ item }: { item: MarketItem }) {
  return (
    <Pressable style={({ pressed }) => [styles.marketCard, pressed && styles.cardPressed]} accessibilityRole="button">
      <View style={[styles.marketImage, { backgroundColor: item.color }]}>
        <Text style={styles.marketImageIcon}>✦</Text>
        <View style={styles.conditionPill}>
          <Text style={styles.conditionPillText}>{item.condition}</Text>
        </View>
      </View>
      <Text style={styles.marketBrand}>{item.brand}</Text>
      <Text style={styles.marketName}>{item.name}</Text>
      <Text style={styles.marketPrice}>{item.price}</Text>
    </Pressable>
  );
}

function UploadItemModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [category, setCategory] = React.useState('Tops');
  const [color, setColor] = React.useState('Soft ivory');
  const [brand, setBrand] = React.useState('Unbranded');
  const [condition, setCondition] = React.useState('Excellent');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.uploadSafeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.uploadKeyboardView}
        >
          <View style={styles.uploadHeader}>
            <Pressable
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close upload item"
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
            <View style={styles.uploadHeaderCopy}>
              <Text style={styles.uploadEyebrow}>New wardrobe piece</Text>
              <Text style={styles.uploadTitle}>Upload Item</Text>
            </View>
            <View style={styles.closeButtonSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.uploadContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable style={styles.cameraPlaceholder} accessibilityRole="button" accessibilityLabel="Add a clothing photo">
              <View style={styles.cameraIconCircle}>
                <Text style={styles.cameraIcon}>⌁</Text>
              </View>
              <Text style={styles.cameraTitle}>Add a photo</Text>
              <Text style={styles.cameraHint}>Tap to capture or upload your item</Text>
            </Pressable>

            <View style={styles.aiCard}>
              <View style={styles.aiHeaderRow}>
                <View>
                  <Text style={styles.aiEyebrow}>Instant recognition</Text>
                  <Text style={styles.aiTitle}>AI Auto-Generated Tags</Text>
                </View>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI</Text>
                </View>
              </View>
              <Text style={styles.aiDescription}>
                Review the suggested details, make quick edits, then save it to your closet.
              </Text>

              <View style={styles.formGrid}>
                <FormField label="Category" value={category} onChangeText={setCategory} placeholder="Tops, Bottoms" />
                <FormField label="Color" value={color} onChangeText={setColor} placeholder="Ivory, Navy" />
                <FormField label="Brand" value={brand} onChangeText={setBrand} placeholder="Brand name" />
                <FormField label="Condition" value={condition} onChangeText={setCondition} placeholder="New, Excellent" />
              </View>
            </View>
          </ScrollView>

          <View style={styles.uploadFooter}>
            <Pressable
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel="Save item to wardrobe"
              onPress={onClose}
            >
              <Text style={styles.saveButtonText}>Save to Wardrobe</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function ItemDetailModal({
  item,
  onClose,
  onSell,
}: {
  item: ClothingItem | null;
  onClose: () => void;
  onSell: () => void;
}) {
  return (
    <Modal visible={Boolean(item)} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.detailSafeArea}>
        {item && (
          <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detailHeaderRow}>
              <Pressable style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close item detail" onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
              <Text style={styles.detailHeaderTitle}>Item Detail</Text>
              <View style={styles.closeButtonSpacer} />
            </View>

            <View style={[styles.detailImage, { backgroundColor: item.color }]}>
              <View style={styles.detailImageBadge}>
                <Text style={styles.detailImageBadgeText}>{item.condition}</Text>
              </View>
              <Text style={styles.detailImageIcon}>◇</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailBrand}>{item.brand}</Text>
              <Text style={styles.detailName}>{item.name}</Text>
              <View style={styles.detailMetaGrid}>
                <DetailMeta label="Category" value={item.category} />
                <DetailMeta label="Condition" value={item.condition} />
                <DetailMeta label="AI price" value={item.estimatedPrice} />
                <DetailMeta label="Fee" value="8%" />
              </View>
              <Text style={styles.detailDescription}>
                WardrobeAI can create a premium listing from your saved item details, suggested price, and closet photo.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.sellButton, pressed && styles.sellButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Sell ${item.name} on Market with an 8 percent fee`}
                onPress={onSell}
              >
                <Text style={styles.sellButtonText}>Sell on Market (8% Fee)</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function SellSuccessModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.successOverlay}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Item instantly listed to Market!</Text>
          <Text style={styles.successText}>Your item is now live in the premium thrift feed with the 8% seller fee applied.</Text>
          <Pressable style={styles.successButton} accessibilityRole="button" accessibilityLabel="Dismiss success message" onPress={onClose}>
            <Text style={styles.successButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailMetaItem}>
      <Text style={styles.detailMetaLabel}>{label}</Text>
      <Text style={styles.detailMetaValue}>{value}</Text>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        selectionColor={palette.accentDark}
      />
    </View>
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
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
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
    elevation: 3,
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
  marketHero: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
    marginBottom: 16,
    marginHorizontal: 6,
    padding: 18,
  },
  marketEyebrow: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  marketTitle: {
    color: palette.text,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
    marginTop: 6,
  },
  marketBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1E4D5',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  marketBadgeText: {
    color: palette.accentDark,
    fontSize: 12,
    fontWeight: '800',
  },
  marketCard: {
    flex: 1,
    padding: 6,
  },
  marketImage: {
    aspectRatio: 0.9,
    borderColor: 'rgba(111, 83, 60, 0.12)',
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 12,
  },
  marketImageIcon: {
    alignSelf: 'center',
    color: palette.accentDark,
    fontSize: 34,
  },
  conditionPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 253, 249, 0.88)',
    borderRadius: 999,
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
  },
  conditionPillText: {
    color: palette.accentDark,
    fontSize: 11,
    fontWeight: '800',
  },
  marketBrand: {
    color: palette.accentDark,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  marketName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  marketPrice: {
    color: palette.sellDark,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
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
    zIndex: 10,
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
    elevation: 12,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#4C3526',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    width: 60,
    zIndex: 20,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  fabIcon: {
    color: palette.surface,
    fontSize: 34,
    lineHeight: 38,
  },
  uploadSafeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  uploadKeyboardView: {
    flex: 1,
  },
  uploadHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  uploadHeaderCopy: {
    alignItems: 'center',
  },
  uploadEyebrow: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  uploadTitle: {
    color: palette.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  closeButtonText: {
    color: palette.accentDark,
    fontSize: 28,
    lineHeight: 30,
  },
  closeButtonSpacer: {
    width: 42,
  },
  uploadContent: {
    paddingHorizontal: 20,
    paddingBottom: 124,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 34,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 280,
    padding: 28,
    shadowColor: '#7C6048',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.11,
    shadowRadius: 24,
    elevation: 3,
  },
  cameraIconCircle: {
    alignItems: 'center',
    backgroundColor: palette.surfaceAlt,
    borderRadius: 999,
    height: 86,
    justifyContent: 'center',
    marginBottom: 18,
    width: 86,
  },
  cameraIcon: {
    color: palette.accentDark,
    fontSize: 42,
    lineHeight: 46,
  },
  cameraTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  cameraHint: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  aiCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 18,
    padding: 20,
  },
  aiHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  aiEyebrow: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aiTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  aiBadge: {
    alignItems: 'center',
    backgroundColor: palette.accentDark,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  aiBadgeText: {
    color: palette.surface,
    fontSize: 12,
    fontWeight: '900',
  },
  aiDescription: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  formGrid: {
    gap: 14,
    marginTop: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '800',
  },
  fieldInput: {
    backgroundColor: '#FBF6EF',
    borderColor: palette.border,
    borderRadius: 18,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  uploadFooter: {
    backgroundColor: 'rgba(248, 242, 234, 0.96)',
    borderColor: palette.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 14,
    position: 'absolute',
    right: 0,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: palette.accentDark,
    borderRadius: 22,
    justifyContent: 'center',
    minHeight: 58,
    shadowColor: '#4C3526',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 4,
  },
  saveButtonText: {
    color: palette.surface,
    fontSize: 17,
    fontWeight: '800',
  },
  detailSafeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  detailContent: {
    padding: 20,
    paddingBottom: 36,
  },
  detailHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailHeaderTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  detailImage: {
    alignItems: 'center',
    borderColor: 'rgba(111, 83, 60, 0.12)',
    borderRadius: 34,
    borderWidth: 1,
    height: 310,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  detailImageBadge: {
    backgroundColor: 'rgba(255, 253, 249, 0.9)',
    borderRadius: 999,
    left: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    top: 18,
  },
  detailImageBadgeText: {
    color: palette.accentDark,
    fontSize: 12,
    fontWeight: '800',
  },
  detailImageIcon: {
    color: palette.accentDark,
    fontSize: 54,
  },
  detailCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 18,
    padding: 20,
  },
  detailBrand: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  detailName: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  detailMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  detailMetaItem: {
    backgroundColor: '#FBF6EF',
    borderColor: palette.border,
    borderRadius: 18,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    padding: 14,
  },
  detailMetaLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  detailMetaValue: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },
  detailDescription: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 18,
  },
  sellButton: {
    alignItems: 'center',
    backgroundColor: palette.sell,
    borderRadius: 22,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 60,
    shadowColor: palette.sellDark,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  },
  sellButtonPressed: {
    backgroundColor: palette.sellDark,
    transform: [{ scale: 0.98 }],
  },
  sellButtonText: {
    color: palette.surface,
    fontSize: 17,
    fontWeight: '900',
  },
  successOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(45, 41, 38, 0.36)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 32,
    maxWidth: 420,
    padding: 26,
    width: '100%',
  },
  successIconCircle: {
    alignItems: 'center',
    backgroundColor: '#E3EFE7',
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    marginBottom: 18,
    width: 72,
  },
  successIcon: {
    color: palette.success,
    fontSize: 38,
    fontWeight: '900',
  },
  successTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  successText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: palette.success,
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 52,
    width: '100%',
  },
  successButtonText: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: '900',
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
