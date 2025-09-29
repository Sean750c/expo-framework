import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { Shield, Eye, Lock, Database, Users, AlertTriangle } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
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

  const HighlightBox: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    color: string;
  }> = ({ title, children, color }) => (
    <View style={[styles.highlightBox, { backgroundColor: color + '20', borderColor: color }]}>
      <Text style={[styles.highlightTitle, { color }]}>{title}</Text>
      <Text style={[styles.highlightText, { color: theme.colors.text }]}>
        {children}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Privacy Policy"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <SlideUpView delay={100} style={styles.intro}>
          <View style={[styles.introCard, { backgroundColor: theme.colors.primary }]}>
            <Shield size={24} color="#FFFFFF" />
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Privacy Policy</Text>
              <Text style={styles.introSubtitle}>
                Your privacy is our priority • Last updated: {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </SlideUpView>

        {/* Key Points */}
        <AnimatedView animation="slideUp" delay={200} style={styles.keyPoints}>
          <Text style={[styles.keyPointsTitle, { color: theme.colors.text }]}>
            Key Privacy Points
          </Text>
          <View style={styles.keyPointsGrid}>
            <View style={[styles.keyPoint, { backgroundColor: theme.colors.surface }]}>
              <Lock size={16} color={theme.colors.success} />
              <Text style={[styles.keyPointText, { color: theme.colors.text }]}>
                Data Encrypted
              </Text>
            </View>
            <View style={[styles.keyPoint, { backgroundColor: theme.colors.surface }]}>
              <Eye size={16} color={theme.colors.primary} />
              <Text style={[styles.keyPointText, { color: theme.colors.text }]}>
                No Selling Data
              </Text>
            </View>
            <View style={[styles.keyPoint, { backgroundColor: theme.colors.surface }]}>
              <Users size={16} color={theme.colors.accent} />
              <Text style={[styles.keyPointText, { color: theme.colors.text }]}>
                User Control
              </Text>
            </View>
          </View>
        </AnimatedView>

        {/* Information We Collect */}
        <Section 
          title="1. Information We Collect" 
          icon={<Database size={20} color={theme.colors.primary} />}
          delay={300}
        >
          <Text style={[styles.subheading, { color: theme.colors.text }]}>
            Personal Information:
          </Text>
          <ListItem>Name, email address, and phone number</ListItem>
          <ListItem>Payment information and banking details</ListItem>
          <ListItem>Government-issued ID for verification</ListItem>
          <ListItem>Profile photo (optional)</ListItem>

          <Text style={[styles.subheading, { color: theme.colors.text }]}>
            Transaction Information:
          </Text>
          <ListItem>Gift card details and images</ListItem>
          <ListItem>Transaction history and amounts</ListItem>
          <ListItem>Communication records with support</ListItem>

          <Text style={[styles.subheading, { color: theme.colors.text }]}>
            Technical Information:
          </Text>
          <ListItem>Device information and IP address</ListItem>
          <ListItem>App usage analytics and crash reports</ListItem>
          <ListItem>Location data (with permission)</ListItem>
        </Section>

        {/* How We Use Information */}
        <Section 
          title="2. How We Use Your Information" 
          icon={<Eye size={20} color={theme.colors.success} />}
          delay={400}
        >
          <Paragraph>
            We use your information to provide, maintain, and improve our services:
          </Paragraph>
          <ListItem>Process gift card transactions and payments</ListItem>
          <ListItem>Verify your identity and prevent fraud</ListItem>
          <ListItem>Provide customer support and resolve issues</ListItem>
          <ListItem>Send important updates and notifications</ListItem>
          <ListItem>Improve our platform and user experience</ListItem>
          <ListItem>Comply with legal and regulatory requirements</ListItem>

          <HighlightBox 
            title="Important" 
            color={theme.colors.warning}
          >
            We never sell your personal information to third parties or use it for advertising purposes outside our platform.
          </HighlightBox>
        </Section>

        {/* Information Sharing */}
        <Section 
          title="3. Information Sharing" 
          icon={<Users size={20} color={theme.colors.accent} />}
          delay={500}
        >
          <Paragraph>
            We may share your information only in these limited circumstances:
          </Paragraph>
          <ListItem>With payment processors to complete transactions</ListItem>
          <ListItem>With verification services for identity checks</ListItem>
          <ListItem>With law enforcement when legally required</ListItem>
          <ListItem>With service providers who help operate our platform</ListItem>
          <ListItem>In case of business merger or acquisition</ListItem>

          <HighlightBox 
            title="Your Control" 
            color={theme.colors.success}
          >
            You can request to see, update, or delete your personal information at any time through your account settings or by contacting support.
          </HighlightBox>
        </Section>

        {/* Data Security */}
        <Section 
          title="4. Data Security" 
          icon={<Lock size={20} color={theme.colors.success} />}
          delay={600}
        >
          <Paragraph>
            We implement industry-standard security measures to protect your information:
          </Paragraph>
          <ListItem>End-to-end encryption for sensitive data</ListItem>
          <ListItem>Secure servers with regular security audits</ListItem>
          <ListItem>Two-factor authentication options</ListItem>
          <ListItem>Regular security training for our team</ListItem>
          <ListItem>Compliance with PCI DSS standards</ListItem>

          <HighlightBox 
            title="Security Tip" 
            color={theme.colors.primary}
          >
            Always use a strong, unique password and enable two-factor authentication to keep your account secure.
          </HighlightBox>
        </Section>

        {/* Data Retention */}
        <Section 
          title="5. Data Retention" 
          delay={700}
        >
          <Paragraph>
            We retain your information for as long as necessary to provide our services and comply with legal obligations:
          </Paragraph>
          <ListItem>Account information: Until account deletion</ListItem>
          <ListItem>Transaction records: 7 years for tax purposes</ListItem>
          <ListItem>Support communications: 3 years</ListItem>
          <ListItem>Marketing preferences: Until you opt out</ListItem>
        </Section>

        {/* Your Rights */}
        <Section 
          title="6. Your Privacy Rights" 
          icon={<Shield size={20} color={theme.colors.primary} />}
          delay={800}
        >
          <Paragraph>
            You have the following rights regarding your personal information:
          </Paragraph>
          <ListItem>Access: Request a copy of your data</ListItem>
          <ListItem>Correction: Update incorrect information</ListItem>
          <ListItem>Deletion: Request removal of your data</ListItem>
          <ListItem>Portability: Export your data</ListItem>
          <ListItem>Opt-out: Unsubscribe from marketing</ListItem>
          <ListItem>Restriction: Limit how we use your data</ListItem>
        </Section>

        {/* Cookies and Tracking */}
        <Section 
          title="7. Cookies and Tracking" 
          delay={900}
        >
          <Paragraph>
            We use cookies and similar technologies to improve your experience:
          </Paragraph>
          <ListItem>Essential cookies for platform functionality</ListItem>
          <ListItem>Analytics cookies to understand usage patterns</ListItem>
          <ListItem>Preference cookies to remember your settings</ListItem>
          
          <Paragraph>
            You can control cookie settings through your browser or device settings.
          </Paragraph>
        </Section>

        {/* Children's Privacy */}
        <Section 
          title="8. Children's Privacy" 
          icon={<AlertTriangle size={20} color={theme.colors.warning} />}
          delay={1000}
        >
          <Paragraph>
            Our service is not intended for children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
          </Paragraph>
        </Section>

        {/* Changes to Policy */}
        <Section 
          title="9. Changes to This Policy" 
          delay={1100}
        >
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </Paragraph>
          <ListItem>Sending an email notification</ListItem>
          <ListItem>Posting a notice in the app</ListItem>
          <ListItem>Updating the "Last Updated" date</ListItem>
        </Section>

        {/* Contact */}
        <AnimatedView animation="bounce" delay={1200} style={styles.contactSection}>
          <View style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
            <Shield size={24} color={theme.colors.primary} />
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
              Privacy Questions?
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy team.
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
  keyPoints: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  keyPointsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  keyPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  keyPointText: {
    fontSize: 12,
    fontWeight: '500',
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
    marginTop: 12,
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
  highlightBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 18,
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
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});