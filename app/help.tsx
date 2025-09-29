import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAppConfig } from '@/src/hooks/useAppConfig';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { Button } from '@/src/components/common/Button';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Shield, 
  CreditCard,
  Wallet,
  ChevronRight,
  ChevronDown,
  ExternalLink
} from 'lucide-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'selling' | 'payment' | 'account';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I sell my gift card?',
    answer: 'To sell your gift card, go to the "Rates" tab, select your gift card type, enter the amount, upload clear photos of both sides, and submit for review. Our team will process it within 24 hours.',
    category: 'selling'
  },
  {
    id: '2',
    question: 'How long does it take to get paid?',
    answer: 'Once your gift card is approved, payment is typically processed within 2-4 hours. You will receive a notification when the payment is completed.',
    category: 'payment'
  },
  {
    id: '3',
    question: 'What gift cards do you accept?',
    answer: 'We accept a wide variety of gift cards including Amazon, iTunes, Google Play, Steam, and many more. Check the "Rates" page for the complete list and current rates.',
    category: 'selling'
  },
  {
    id: '4',
    question: 'How do I withdraw my money?',
    answer: 'Go to your Wallet, tap "Withdraw", select your preferred payment method (bank transfer, PayPal, etc.), enter the amount, and confirm. Withdrawals are processed within 1-3 business days.',
    category: 'payment'
  },
  {
    id: '5',
    question: 'Why was my gift card rejected?',
    answer: 'Gift cards may be rejected for various reasons: unclear photos, already used cards, damaged cards, or cards from unsupported regions. Always upload clear, readable photos.',
    category: 'selling'
  },
  {
    id: '6',
    question: 'How do I update my profile information?',
    answer: 'Go to the Profile tab, tap the edit icon next to your name, update your information, and save. Some changes may require verification.',
    category: 'account'
  },
  {
    id: '7',
    question: 'Is my personal information secure?',
    answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and financial information. We never share your data with third parties.',
    category: 'account'
  },
  {
    id: '8',
    question: 'What are the fees for selling gift cards?',
    answer: 'We don\'t charge any fees for selling gift cards. The rate you see is what you get. However, withdrawal fees may apply depending on your chosen payment method.',
    category: 'general'
  }
];

const HelpCenterContent: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { getContactInfo } = useAppConfig();
  const contactInfo = getContactInfo();
  
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | FAQItem['category']>('all');

  const categories = [
    { key: 'all' as const, label: 'All', icon: HelpCircle },
    { key: 'general' as const, label: 'General', icon: FileText },
    { key: 'selling' as const, label: 'Selling', icon: CreditCard },
    { key: 'payment' as const, label: 'Payment', icon: Wallet },
    { key: 'account' as const, label: 'Account', icon: Shield },
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = async (method: 'phone' | 'email' | 'whatsapp') => {
    try {
      switch (method) {
        case 'phone':
          if (contactInfo.servicePhone) {
            await Linking.openURL(`tel:${contactInfo.servicePhone}`);
          } else {
            Alert.alert('Phone Support', 'Phone support is currently unavailable.');
          }
          break;
        case 'email':
          if (contactInfo.email) {
            await Linking.openURL(`mailto:${contactInfo.email}`);
          } else {
            Alert.alert('Email Support', 'Email support is currently unavailable.');
          }
          break;
        case 'whatsapp':
          if (contactInfo.whatsappPhone && contactInfo.whatsappEnable) {
            await Linking.openURL(`https://wa.me/${contactInfo.whatsappPhone}`);
          } else {
            Alert.alert('WhatsApp Support', 'WhatsApp support is currently unavailable.');
          }
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the contact method. Please try again.');
    }
  };

  const ContactCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onPress: () => void;
    available: boolean;
  }> = ({ title, description, icon, onPress, available }) => (
    <TouchableOpacity
      style={[
        styles.contactCard,
        { 
          backgroundColor: theme.colors.surface,
          opacity: available ? 1 : 0.6
        }
      ]}
      onPress={available ? onPress : undefined}
      disabled={!available}
      activeOpacity={0.7}
    >
      <View style={styles.contactIcon}>
        {icon}
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const FAQCard: React.FC<{ faq: FAQItem }> = ({ faq }) => {
    const isExpanded = expandedFAQ === faq.id;
    
    return (
      <AnimatedView animation="fade" delay={100}>
        <TouchableOpacity
          style={[styles.faqCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => toggleFAQ(faq.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeader}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              {faq.question}
            </Text>
            <View style={[styles.faqToggle, { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }]}>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </View>
          </View>
          
          {isExpanded && (
            <AnimatedView animation="slideUp" delay={0}>
              <View style={styles.faqAnswer}>
                <Text style={[styles.faqAnswerText, { color: theme.colors.textSecondary }]}>
                  {faq.answer}
                </Text>
              </View>
            </AnimatedView>
          )}
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Help Center"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <SlideUpView delay={100} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Need Help?
          </Text>
          
          <View style={styles.quickActions}>
            <AnimatedView animation="scale" delay={200}>
              <ContactCard
                title="Live Chat"
                description="Chat with our support team"
                icon={<MessageCircle size={24} color={theme.colors.primary} />}
                onPress={() => Alert.alert('Live Chat', 'Live chat feature coming soon!')}
                available={false}
              />
            </AnimatedView>
            
            <AnimatedView animation="scale" delay={300}>
              <ContactCard
                title="Call Support"
                description="Speak directly with our team"
                icon={<Phone size={24} color={theme.colors.success} />}
                onPress={() => handleContactSupport('phone')}
                available={!!contactInfo.servicePhone}
              />
            </AnimatedView>
            
            <AnimatedView animation="scale" delay={400}>
              <ContactCard
                title="Email Support"
                description="Send us a detailed message"
                icon={<Mail size={24} color={theme.colors.accent} />}
                onPress={() => handleContactSupport('email')}
                available={!!contactInfo.email}
              />
            </AnimatedView>
            
            {contactInfo.whatsappEnable && (
              <AnimatedView animation="scale" delay={500}>
                <ContactCard
                  title="WhatsApp"
                  description="Message us on WhatsApp"
                  icon={<MessageCircle size={24} color="#25D366" />}
                  onPress={() => handleContactSupport('whatsapp')}
                  available={!!contactInfo.whatsappPhone}
                />
              </AnimatedView>
            )}
          </View>
        </SlideUpView>

        {/* FAQ Categories */}
        <AnimatedView animation="slideUp" delay={600} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.key;
              
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected 
                        ? theme.colors.primary 
                        : theme.colors.surface
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <IconComponent 
                    size={16} 
                    color={isSelected ? '#FFFFFF' : theme.colors.textSecondary} 
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: isSelected 
                          ? '#FFFFFF' 
                          : theme.colors.text
                      }
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </AnimatedView>

        {/* FAQ List */}
        <SlideUpView delay={700} style={styles.section}>
          <View style={styles.faqList}>
            {filteredFAQs.map((faq, index) => (
              <View key={faq.id} style={{ marginBottom: 12 }}>
                <FAQCard faq={faq} />
              </View>
            ))}
          </View>
          
          {filteredFAQs.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <HelpCircle size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No FAQs found for this category
              </Text>
            </View>
          )}
        </SlideUpView>

        {/* Additional Resources */}
        <AnimatedView animation="slideUp" delay={800} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Additional Resources
          </Text>
          
          <View style={styles.resourcesList}>
            <TouchableOpacity
              style={[styles.resourceItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/terms-of-service' as any)}
            >
              <FileText size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceText, { color: theme.colors.text }]}>
                Terms of Service
              </Text>
              <ExternalLink size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.resourceItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/privacy-policy' as any)}
            >
              <Shield size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceText, { color: theme.colors.text }]}>
                Privacy Policy
              </Text>
              <ExternalLink size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.resourceItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/(tabs)/rates' as any)}
            >
              <CreditCard size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceText, { color: theme.colors.text }]}>
                Supported Gift Cards
              </Text>
              <ChevronRight size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Contact CTA */}
        <AnimatedView animation="bounce" delay={900} style={styles.ctaSection}>
          <View style={[styles.ctaCard, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.ctaTitle}>Still Need Help?</Text>
            <Text style={styles.ctaSubtitle}>
              Our support team is here to help you 24/7
            </Text>
            <Button
              title="Contact Support"
              onPress={() => handleContactSupport('email')}
              variant="secondary"
              style={styles.ctaButton}
            />
          </View>
        </AnimatedView>
      </ScrollView>
    </View>
  );
};

export default function HelpCenterScreen() {
  return <HelpCenterContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    borderRadius: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqToggle: {
    transition: 'transform 0.2s ease',
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  resourcesList: {
    gap: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  resourceText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ctaCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    minWidth: 160,
  },
});