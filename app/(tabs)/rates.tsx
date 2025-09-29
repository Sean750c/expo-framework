import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  TextInput,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useGiftCardStore } from '@/src/store/giftCardStore';
import { useDebounce } from '@/src/hooks/useDebounce';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { AppHeader } from '@/src/components/common/AppHeader';
import { SkeletonList, SkeletonCard } from '@/src/components/common/SkeletonLoader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Star,
  Flame
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const RatesContent: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { giftCards, loading, error, fetchGiftCards } = useGiftCardStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchGiftCards();
  }, [fetchGiftCards]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGiftCards();
    setRefreshing(false);
  };

  const categories = ['All', 'E-commerce', 'Entertainment', 'Gaming', 'Food', 'Fashion'];
  
  const filteredCards = giftCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         card.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
    return matchesSearch && matchesCategory && card.isActive;
  });

  const popularCards = giftCards.filter(card => card.isActive).slice(0, 3);
  const highRateCards = giftCards
    .filter(card => card.isActive && card.rate >= 0.8)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 4);

  const handleSellCard = (cardId?: string) => {
    if (cardId) {
      router.push(`/sell-card?cardId=${cardId}` as any);
    } else {
      router.push('/sell-card' as any);
    }
  };

  const handleCardPress = (cardId: string) => {
    router.push(`/giftcard-detail/${cardId}` as any);
  };

  if (loading && giftCards.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AppHeader 
          title="Live Rates" 
          subtitle="Get the best rates for your gift cards"
          rightComponent={
            <View style={[styles.liveIndicator, { backgroundColor: theme.colors.success }]}>
              <View style={styles.liveDot} />
              <Text style={[styles.liveText, { color: theme.colors.success }]}>LIVE</Text>
            </View>
          }
        />
        <SkeletonList count={8} />
      </View>
    );
  }

  if (error && giftCards.length === 0) {
    return (
      <EmptyState
        title="Failed to load rates"
        description={error}
        actionText="Try Again"
        onAction={fetchGiftCards}
        icon={<TrendingUp size={48} color={theme.colors.textSecondary} />}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Rates"
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Search Bar */}
        <AnimatedView animation="slideUp" delay={100} style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search gift cards..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </AnimatedView>

        {/* Quick Sell CTA */}
        <SlideUpView delay={200} style={styles.ctaContainer}>
          <View style={[styles.ctaCard, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.ctaContent}>
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>Sell Your Gift Card Now</Text>
                <Text style={styles.ctaSubtitle}>Get instant quotes • Fast processing</Text>
              </View>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => handleSellCard()}
              >
                <Zap size={20} color={theme.colors.primary} />
                <Text style={[styles.ctaButtonText, { color: theme.colors.primary }]}>
                  Sell Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SlideUpView>

        {/* Features */}
        <AnimatedView animation="slideUp" delay={300} style={styles.featuresContainer}>
          <View style={[styles.featureItem, { backgroundColor: theme.colors.surface }]}>
            <Shield size={16} color={theme.colors.success} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>100% Secure</Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: theme.colors.surface }]}>
            <Clock size={16} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>Fast Processing</Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: theme.colors.surface }]}>
            <TrendingUp size={16} color={theme.colors.accent} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>Best Rates</Text>
          </View>
        </AnimatedView>

        {/* Popular Cards */}
        {popularCards.length > 0 && (
          <SlideUpView delay={400} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Flame size={20} color={theme.colors.error} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Popular Cards
                </Text>
              </View>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {popularCards.map((card) => (
                <AnimatedView
                  key={card.id}
                  animation="scale"
                  delay={500 + popularCards.indexOf(card) * 100}
                >
                  <TouchableOpacity
                    style={[styles.popularCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => handleCardPress(card.id)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: card.logo }} style={styles.popularCardLogo} />
                    <Text style={[styles.popularCardName, { color: theme.colors.text }]}>
                      {card.name}
                    </Text>
                    <View style={[styles.rateContainer, { backgroundColor: theme.colors.success + '20' }]}>
                      <Text style={[styles.rateText, { color: theme.colors.success }]}>
                        {(card.rate * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <Button
                      title="Sell Now"
                      onPress={() => handleSellCard(card.id)}
                      size="small"
                      style={styles.sellButton}
                    />
                  </TouchableOpacity>
                </AnimatedView>
              ))}
            </ScrollView>
          </SlideUpView>
        )}

        {/* High Rate Cards */}
        {highRateCards.length > 0 && (
          <SlideUpView delay={600} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Star size={20} color={theme.colors.accent} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Highest Rates
                </Text>
              </View>
            </View>
            
            <View style={styles.highRateGrid}>
              {highRateCards.map((card) => (
                <AnimatedView
                  key={card.id}
                  animation="slideLeft"
                  delay={700 + highRateCards.indexOf(card) * 100}
                >
                  <TouchableOpacity
                    style={[styles.highRateCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => handleCardPress(card.id)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: card.logo }} style={styles.highRateCardLogo} />
                    <View style={styles.highRateCardInfo}>
                      <Text style={[styles.highRateCardName, { color: theme.colors.text }]}>
                        {card.name}
                      </Text>
                      <Text style={[styles.highRateCardBrand, { color: theme.colors.textSecondary }]}>
                        {card.brand}
                      </Text>
                      <View style={styles.highRateCardBottom}>
                        <Text style={[styles.highRateValue, { color: theme.colors.success }]}>
                          {(card.rate * 100).toFixed(1)}%
                        </Text>
                        <ArrowRight size={16} color={theme.colors.textSecondary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </AnimatedView>
              ))}
            </View>
          </SlideUpView>
        )}

        {/* Category Filter */}
        <AnimatedView animation="slideUp" delay={800} style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === category 
                      ? theme.colors.primary 
                      : theme.colors.surface
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedCategory === category 
                        ? '#FFFFFF' 
                        : theme.colors.text
                    }
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimatedView>

        {/* All Cards List */}
        <SlideUpView delay={900} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            All Gift Cards ({filteredCards.length})
          </Text>
          
          <View style={styles.cardsGrid}>
            {filteredCards.map((card) => (
              <AnimatedView
                key={card.id}
                animation="fade"
                delay={1000 + filteredCards.indexOf(card) * 50}
              >
                <TouchableOpacity
                  style={[styles.cardItem, { backgroundColor: theme.colors.surface }]}
                  onPress={() => handleCardPress(card.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <Image source={{ uri: card.logo }} style={styles.cardLogo} />
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardName, { color: theme.colors.text }]}>
                        {card.name}
                      </Text>
                      <Text style={[styles.cardBrand, { color: theme.colors.textSecondary }]}>
                        {card.brand}
                      </Text>
                    </View>
                    <View style={[styles.rateTag, { backgroundColor: theme.colors.primary + '20' }]}>
                      <Text style={[styles.rateTagText, { color: theme.colors.primary }]}>
                        {(card.rate * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={[styles.cardRange, { color: theme.colors.textSecondary }]}>
                      ${card.minAmount} - ${card.maxAmount}
                    </Text>
                    <TouchableOpacity
                      style={[styles.quickSellButton, { backgroundColor: theme.colors.primary }]}
                      onPress={() => handleSellCard(card.id)}
                    >
                      <Text style={styles.quickSellText}>Sell</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>
        </SlideUpView>

        {filteredCards.length === 0 && (
          <EmptyState
            title="No cards found"
            description="Try adjusting your search or filter criteria"
            icon={<Search size={48} color={theme.colors.textSecondary} />}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default function RatesScreen() {
  return (
    <AuthGuard>
      <RatesContent />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0.9,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ctaCard: {
    borderRadius: 16,
    padding: 20,
  },
  ctaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  popularCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  popularCardLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  popularCardName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  rateContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sellButton: {
    width: '100%',
  },
  highRateGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  highRateCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  highRateCardLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
  },
  highRateCardInfo: {
    flex: 1,
  },
  highRateCardName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  highRateCardBrand: {
    fontSize: 12,
    marginBottom: 4,
  },
  highRateCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highRateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardsGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cardItem: {
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardBrand: {
    fontSize: 12,
  },
  rateTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rateTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRange: {
    fontSize: 12,
  },
  quickSellButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickSellText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});