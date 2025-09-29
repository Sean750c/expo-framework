import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react-native';

export default function TermsOfServiceScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const Section: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    delay?: number;
  }> = ({ title, children, icon, delay = 0 }) => (
    <AnimatedView animation="slideUp" delay={delay} style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
      </View>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
        {children}
      </View>
    </AnimatedView>
  );

  const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
      {children}
    </Text>
  );

  const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={styles.listItem}>
      <View style={[styles.bullet, { backgroundColor: theme.colors.primary }]} />
      <Text style={[styles.listText, { color: theme.colors.textSecondary }]}>
        {children}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Terms of Service"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <SlideUpView delay={100} style={styles.intro}>
          <View style={[styles.introCard, { backgroundColor: theme.colors.primary }]}>
            <FileText size={24} color="#FFFFFF" />
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Terms of Service</Text>
              <Text style={styles.introSubtitle}>
                Last updated: {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </SlideUpView>

        {/* Agreement */}
        <Section 
          title="1. Agreement to Terms" 
          icon={<CheckCircle size={20} color={theme.colors.success} />}
          delay={200}
        >
          <Paragraph>
            By accessing and using our gift card trading platform, you accept and agree to be bound by the terms and provision of this agreement.
          </Paragraph>
          <Paragraph>
            If you do not agree to abide by the above, please do not use this service.
          </Paragraph>
        </Section>

        {/* Service Description */}
        <Section 
          title="2. Service Description" 
          icon={<Shield size={20} color={theme.colors.primary} />}
          delay={300}
        >
          <Paragraph>
            Our platform provides a marketplace for users to sell their unused gift cards for cash. We act as an intermediary between sellers and buyers.
          </Paragraph>
          <Text style={[styles.subheading, { color: theme.colors.text }]}>
            Our services include:
          </Text>
          <ListItem>Gift card verification and authentication</ListItem>
          <ListItem>Secure payment processing</ListItem>
          <ListItem>Customer support and dispute resolution</ListItem>
          <ListItem>Account management and transaction history</ListItem>
        </Section>

        {/* User Responsibilities */}
        <Section 
          title="3. User Responsibilities" 
          icon={<AlertCircle size={20} color={theme.colors.warning} />}
          delay={400}
        >
          <Paragraph>
            As a user of our platform, you agree to:
          </Paragraph>
          <ListItem>Provide accurate and truthful information</ListItem>
          <ListItem>Only sell legitimate, unused gift cards</ListItem>
          <ListItem>Comply with all applicable laws and regulations</ListItem>
          <ListItem>Maintain the security of your account credentials</ListItem>
          <ListItem>Not engage in fraudulent or deceptive practices</ListItem>
        </Section>

        {/* Prohibited Activities */}
        <Section 
          title="4. Prohibited Activities" 
          delay={500}
        >
          <Paragraph>
            The following activities are strictly prohibited:
          </Paragraph>
          <ListItem>Selling stolen, fraudulent, or invalid gift cards</ListItem>
          <ListItem>Creating multiple accounts to circumvent limits</ListItem>
          <ListItem>Attempting to manipulate or hack the platform</ListItem>
          <ListItem>Harassing other users or our support team</ListItem>
          <ListItem>Using the service for money laundering or illegal activities</ListItem>
        </Section>

        {/* Payment Terms */}
        <Section 
          title="5. Payment Terms" 
          delay={600}
        >
          <Paragraph>
            Payment for accepted gift cards will be processed according to our standard procedures:
          </Paragraph>
          <ListItem>Payments are made after successful verification</ListItem>
          <ListItem>Processing time is typically 2-4 hours</ListItem>
          <ListItem>Minimum withdrawal amounts may apply</ListItem>
          <ListItem>We reserve the right to hold payments for security reviews</ListItem>
        </Section>

        {/* Limitation of Liability */}
        <Section 
          title="6. Limitation of Liability" 
          delay={700}
        >
          <Paragraph>
            Our liability is limited to the maximum extent permitted by law. We are not responsible for:
          </Paragraph>
          <ListItem>Indirect, incidental, or consequential damages</ListItem>
          <ListItem>Loss of profits, data, or business opportunities</ListItem>
          <ListItem>Third-party actions or system failures</ListItem>
          <ListItem>Market fluctuations in gift card values</ListItem>
        </Section>

        {/* Privacy */}
        <Section 
          title="7. Privacy" 
          delay={800}
        >
          <Paragraph>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
          </Paragraph>
        </Section>

        {/* Modifications */}
        <Section 
          title="8. Modifications" 
          delay={900}
        >
          <Paragraph>
            We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms.
          </Paragraph>
        </Section>

        {/* Contact */}
        <AnimatedView animation="bounce" delay={1000} style={styles.contactSection}>
          <View style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
              Questions about our Terms?
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              If you have any questions about these Terms of Service, please contact our support team.
            </Text>
          </View>
        </AnimatedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  intro: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  introText: {
    marginLeft: 16,
    flex: 1,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    padding: 16,
    borderRadius: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginRight: 12,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  contactSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  contactCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});