import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useGiftCardStore } from '@/src/store/giftCardStore';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Loading } from '@/src/components/common/Loading';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { Gift, TrendingUp, Shield, Clock } from 'lucide-react-native';

const GiftCardsContent: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { giftCards, loading, error, fetchGiftCards } = useGiftCardStore();

  useEffect(() => {
    fetchGiftCards();
  }, [fetchGiftCards]);

  const handleSellCard = () => {
    router.push('/sell-card' as any);
  };

  const handleCardPress = (cardId: string) => {
    router.push(`/giftcard-detail/${cardId}` as any);
  };

  if (loading && giftCards.length === 0) {
    return <Loading text="Loading gift cards..." />;
  }

  if (error && giftCards.length === 0) {
    return (
      <EmptyState
        title="Failed to load gift cards"
        description={error}
        actionText="Try Again"
        onAction={fetchGiftCards}
        icon={<Gift size={48} color={theme.colors.textSecondary} />}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Gift Cards
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Turn your unused gift cards into cash
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <TrendingUp size={24} color={theme.colors.primary} />
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Best Rates
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Up to 85% value
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Clock size={24} color={theme.colors.secondary} />
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Fast Processing
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Within 24 hours
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Shield size={24} color={theme.colors.accent} />
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Secure
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              100% safe & reliable
            </Text>
          </View>
        </View>

        {/* Sell Card Button */}
        <View style={styles.sellButtonContainer}>
          <Button
            title="Sell Your Gift Card"
            onPress={handleSellCard}
            size="large"
            style={styles.sellButton}
          />
        </View>

        {/* Gift Cards List */}
        <View style={styles.cardsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Supported Gift Cards
          </Text>
          
          <View style={styles.cardsGrid}>
            {giftCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardItem, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleCardPress(card.id)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: card.logo }} style={styles.cardLogo} />
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, { color: theme.colors.text }]}>
                    {card.name}
                  </Text>
                  <Text style={[styles.cardCategory, { color: theme.colors.textSecondary }]}>
                    {card.category}
                  </Text>
                  <View style={styles.cardRate}>
                    <Text style={[styles.rateText, { color: theme.colors.primary }]}>
                      {(card.rate * 100).toFixed(0)}% rate
                    </Text>
                    <Text style={[styles.rangeText, { color: theme.colors.textSecondary }]}>
                      ${card.minAmount}-${card.maxAmount}
                    </Text>
                  </View>
                </View>
                {card.isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.colors.success }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function GiftCardsScreen() {
  return (
    <AuthGuard>
      <GiftCardsContent />
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  sellButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sellButton: {
    borderRadius: 12,
  },
  cardsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardsGrid: {
    gap: 12,
  },
  cardItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  cardLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  cardRate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rangeText: {
    fontSize: 12,
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});