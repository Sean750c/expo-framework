import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useGiftCardStore } from '@/src/store/giftCardStore';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Modal } from '@/src/components/common/Modal';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { GiftCard } from '@/src/types/giftcard';
import { GiftCardService } from '@/src/api/giftCardService';
import { 
  Camera, 
  Upload, 
  X, 
  ChevronDown, 
  DollarSign,
  AlertCircle 
} from 'lucide-react-native';

interface SellCardForm {
  giftCardId: string;
  amount: number;
  cardNumber?: string;
  cardPin?: string;
}

const sellCardSchema = yup.object({
  giftCardId: yup.string().required('Please select a gift card type'),
  amount: yup
    .number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0'),
  cardNumber: yup.string().optional(),
  cardPin: yup.string().optional(),
});

const SellCardContent: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { giftCards, fetchGiftCards, submitGiftCard, loading } = useGiftCardStore();
  
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [estimatedValue, setEstimatedValue] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SellCardForm>({
    resolver: yupResolver(sellCardSchema),
    mode: 'onChange',
  });

  const watchedAmount = watch('amount');
  const watchedGiftCardId = watch('giftCardId');

  useEffect(() => {
    fetchGiftCards();
  }, [fetchGiftCards]);

  useEffect(() => {
    if (selectedCard && watchedAmount) {
      setEstimatedValue(watchedAmount * selectedCard.rate);
    } else {
      setEstimatedValue(0);
    }
  }, [selectedCard, watchedAmount]);

  useEffect(() => {
    if (watchedGiftCardId) {
      const card = giftCards.find(c => c.id === watchedGiftCardId);
      setSelectedCard(card || null);
    }
  }, [watchedGiftCardId, giftCards]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const showImagePicker = () => {
    Alert.alert(
      'Add Image',
      'Choose how you want to add the gift card image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const onSubmit = async (data: SellCardForm) => {
    if (!user?.id) return;
    
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please upload at least one image of your gift card.');
      return;
    }

    try {
      // Upload images first
      const uploadedImages = await Promise.all(
        images.map(imageUri => GiftCardService.uploadImage(imageUri))
      );

      const submission = {
        userId: user.id,
        giftCardId: data.giftCardId,
        giftCardName: selectedCard?.name || '',
        amount: data.amount,
        cardNumber: data.cardNumber,
        cardPin: data.cardPin,
        images: uploadedImages.map(img => img.url),
        estimatedValue,
      };

      await submitGiftCard(submission);
      
      Alert.alert(
        'Success!',
        'Your gift card has been submitted for review. You will be notified once it\'s processed.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit gift card');
    }
  };

  const selectCard = (card: GiftCard) => {
    setSelectedCard(card);
    setValue('giftCardId', card.id);
    setShowCardPicker(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Sell Gift Card"
        subtitle="Turn your gift cards into cash"
        showBackButton
        onBackPress={() => router.back()}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form */}
        <SlideUpView delay={100} style={styles.form}>
          {/* Gift Card Selection */}
          <AnimatedView animation="slideUp" delay={200}>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Gift Card Type *
              </Text>
              <TouchableOpacity
                style={[
                  styles.cardSelector,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: errors.giftCardId ? theme.colors.error : theme.colors.border
                  }
                ]}
                onPress={() => setShowCardPicker(true)}
              >
                {selectedCard ? (
                  <View style={styles.selectedCard}>
                    <Image source={{ uri: selectedCard.logo }} style={styles.cardLogo} />
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardName, { color: theme.colors.text }]}>
                        {selectedCard.name}
                      </Text>
                      <Text style={[styles.cardRate, { color: theme.colors.primary }]}>
                        {(selectedCard.rate * 100).toFixed(0)}% rate
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
                    Select gift card type
                  </Text>
                )}
                <ChevronDown size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {errors.giftCardId && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.giftCardId.message}
                </Text>
              )}
            </View>
          </AnimatedView>

          {/* Amount */}
          <AnimatedView animation="slideUp" delay={300}>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Gift Card Amount *"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={errors.amount?.message}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  required
                />
              )}
            />
          </AnimatedView>

          {/* Estimated Value */}
          {estimatedValue > 0 && (
            <AnimatedView animation="scale" delay={400}>
              <View style={[styles.estimatedValue, { backgroundColor: theme.colors.surface }]}>
                <DollarSign size={20} color={theme.colors.success} />
                <Text style={[styles.estimatedText, { color: theme.colors.text }]}>
                  Estimated Value: 
                  <Text style={{ color: theme.colors.success, fontWeight: '600' }}>
                    {' '}${estimatedValue.toFixed(2)}
                  </Text>
                </Text>
              </View>
            </AnimatedView>
          )}

          {/* Card Details */}
          <AnimatedView animation="slideUp" delay={500}>
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Card Number (Optional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cardNumber?.message}
                  placeholder="Enter card number if available"
                  autoCapitalize="none"
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={600}>
            <Controller
              control={control}
              name="cardPin"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Card PIN/Code (Optional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cardPin?.message}
                  placeholder="Enter PIN or security code if available"
                  secureTextEntry
                />
              )}
            />
          </AnimatedView>

          {/* Images */}
          <AnimatedView animation="slideUp" delay={700}>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                Gift Card Images *
              </Text>
              <Text style={[styles.fieldDescription, { color: theme.colors.textSecondary }]}>
                Upload clear photos of both sides of your gift card
              </Text>
              
              <View style={styles.imagesContainer}>
                {images.map((imageUri, index) => (
                  <AnimatedView
                    key={index}
                    animation="scale"
                    delay={800 + index * 100}
                  >
                    <View style={styles.imageItem}>
                      <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                      <TouchableOpacity
                        style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]}
                        onPress={() => removeImage(index)}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </AnimatedView>
                ))}
                
                {images.length < 4 && (
                  <TouchableOpacity
                    style={[styles.addImageButton, { backgroundColor: theme.colors.surface }]}
                    onPress={showImagePicker}
                  >
                    <Upload size={24} color={theme.colors.primary} />
                    <Text style={[styles.addImageText, { color: theme.colors.primary }]}>
                      Add Image
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </AnimatedView>

          {/* Warning */}
          <AnimatedView animation="bounce" delay={900}>
            <View style={[styles.warningContainer, { backgroundColor: theme.colors.warning + '20' }]}>
              <AlertCircle size={20} color={theme.colors.warning} />
              <Text style={[styles.warningText, { color: theme.colors.text }]}>
                Please ensure your gift card images are clear and readable. 
                Blurry or unreadable images may result in rejection.
              </Text>
            </View>
          </AnimatedView>

          {/* Submit Button */}
          <AnimatedView animation="bounce" delay={1000}>
            <Button
              title="Submit for Review"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!isValid || images.length === 0}
              size="large"
              style={styles.submitButton}
            />
          </AnimatedView>
        </SlideUpView>
      </ScrollView>

      {/* Gift Card Picker Modal */}
      <Modal
        visible={showCardPicker}
        onClose={() => setShowCardPicker(false)}
        title="Select Gift Card"
      >
        <ScrollView style={styles.cardPickerContent}>
          {giftCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardOption, { backgroundColor: theme.colors.background }]}
              onPress={() => selectCard(card)}
            >
              <Image source={{ uri: card.logo }} style={styles.cardLogo} />
              <View style={styles.cardInfo}>
                <Text style={[styles.cardName, { color: theme.colors.text }]}>
                  {card.name}
                </Text>
                <Text style={[styles.cardDetails, { color: theme.colors.textSecondary }]}>
                  {(card.rate * 100).toFixed(0)}% rate • ${card.minAmount}-${card.maxAmount}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};

export default function SellCardScreen() {
  return (
    <AuthGuard>
      <SellCardContent />
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
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  fieldDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  cardSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardLogo: {
    width: 40,
    height: 40,
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
  cardRate: {
    fontSize: 12,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  estimatedValue: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  estimatedText: {
    fontSize: 14,
    marginLeft: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageItem: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  submitButton: {
    borderRadius: 12,
  },
  cardPickerContent: {
    maxHeight: 400,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 12,
  },
});