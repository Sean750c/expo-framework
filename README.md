# React Native Expo Project Scaffold

A comprehensive, production-ready React Native Expo project scaffold with TypeScript, featuring modern architecture patterns, state management, and development tools.

## 🚀 Features

### Core Architecture
- **TypeScript**: Full TypeScript support with strict mode
- **Expo Router**: File-based routing with tab navigation
- **State Management**: Zustand for lightweight, efficient state management
- **API Layer**: Axios-based client with interceptors and error handling
- **Theme System**: Light/dark mode support with consistent design tokens

### Components & UI
- **Common Components**: Button, Input, Modal, Loading, EmptyState, ListItem
- **Cross-platform**: Android/iOS/Web compatibility
- **Responsive Design**: Mobile-first with adaptive layouts
- **Animations**: React Native Reanimated for smooth interactions

### Hooks & Utilities
- **Custom Hooks**: useAuth, useTheme, usePagination, useDebounce, useNetwork, useAppState, useRequest
- **Utilities**: Storage, formatters, validation, logger
- **Form Handling**: React Hook Form with Yup validation

### Developer Experience
- **ESLint + Prettier**: Code quality and consistency
- **Error Handling**: Global ErrorBoundary with logging
- **Scaffold Generator**: CLI tools for rapid component/hook generation
- **Environment Config**: Development/staging/production configurations

### Security & Auth
- **Auth Guards**: Route protection with role-based access
- **Token Management**: Automatic token refresh and storage
- **Permission System**: Extensible permission framework

## 📁 Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   └── common/         # Common components (Button, Input, etc.)
├── screens/            # Screen components
├── hooks/              # Custom React hooks
├── store/              # Zustand store modules
├── api/                # API client and services
├── utils/              # Utility functions
├── styles/             # Theme and styling
├── constants/          # App constants
├── guards/             # Route guards
├── config/             # Environment configuration
└── types/              # TypeScript type definitions

app/                    # Expo Router file-based routing
├── (tabs)/            # Tab navigation
│   ├── index.tsx      # Home screen
│   ├── profile.tsx    # Profile screen
│   └── settings.tsx   # Settings screen
└── _layout.tsx        # Root layout

scripts/
└── scaffold.js        # Component generation script
\`\`\`

## 🛠 Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build:web
\`\`\`

## 🏗 Scaffold Generator

Generate components, screens, hooks, and utilities quickly:

\`\`\`bash
# Generate a new component
npm run scaffold component MyButton

# Generate a new screen
npm run scaffold screen Profile

# Generate a new hook
npm run scaffold hook LocalStorage

# Generate a new utility
npm run scaffold util ApiHelper
\`\`\`

## 🎨 Theme System

The app includes a comprehensive theme system with:

- **Colors**: Primary, secondary, accent, semantic colors
- **Typography**: Consistent font sizing and weights  
- **Spacing**: 8px grid system
- **Dark Mode**: Automatic theme switching

### Usage

\`\`\`tsx
import { useTheme } from '@/src/hooks/useTheme';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
}
\`\`\`

## 🔐 Authentication

Built-in authentication system with:

- Login/register functionality
- Token management with automatic refresh
- Route protection with AuthGuard
- User profile management

### Usage

\`\`\`tsx
import { useAuthStore } from '@/src/store/authStore';
import { AuthGuard } from '@/src/guards/AuthGuard';

function ProtectedScreen() {
  return (
    <AuthGuard>
      <MyScreen />
    </AuthGuard>
  );
}
\`\`\`

## 🌐 API Integration

Centralized API client with:

- Request/response interceptors
- Automatic token handling
- Error handling and logging
- TypeScript support

### Usage

\`\`\`tsx
import { useRequest } from '@/src/hooks/useRequest';
import { apiClient } from '@/src/api/client';

function MyComponent() {
  const { data, loading, error, execute } = useRequest(
    () => apiClient.get('/users'),
    { immediate: true }
  );

  if (loading) return <Loading />;
  if (error) return <EmptyState title="Error" description={error.message} />;
  
  return <UserList users={data} />;
}
\`\`\`

## 🎯 State Management

Using Zustand for state management:

\`\`\`tsx
import { create } from 'zustand';

interface CountStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
\`\`\`

## 📋 Form Handling

Using React Hook Form with Yup validation:

\`\`\`tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/src/utils/validation';

function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <Input
          {...field}
          label="Email"
          error={errors.email?.message}
        />
      )}
    />
  );
}
\`\`\`

## 🔧 Environment Configuration

Configure different environments:

\`\`\`typescript
// src/config/index.ts
const config = {
  development: {
    API_BASE_URL: 'https://api-dev.example.com',
    ENABLE_LOGGING: true,
  },
  production: {
    API_BASE_URL: 'https://api.example.com', 
    ENABLE_LOGGING: false,
  },
};
\`\`\`

## 📱 Cross-Platform Support

The scaffold is optimized for:
- **iOS**: Native iOS experience
- **Android**: Material Design patterns
- **Web**: Responsive web interface

## 🚦 Error Handling

Global error handling with:
- ErrorBoundary for React errors
- API error interceptors
- Logging system with remote reporting
- User-friendly error messages

## 📊 Logging

Built-in logging system:

\`\`\`tsx
import { logger } from '@/src/utils/logger';

logger.info('User logged in');
logger.warn('Slow API response');
logger.error('API request failed', error);
\`\`\`

## 🎯 Best Practices

- **TypeScript**: Strict typing throughout
- **Component Structure**: Single responsibility components
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **File Organization**: Feature-based folder structure
- **Performance**: Lazy loading and memoization
- **Accessibility**: WCAG compliant components

## 📄 License

MIT License - feel free to use this scaffold for your projects!

---

This scaffold provides a solid foundation for React Native apps with modern development practices, comprehensive tooling, and production-ready architecture.
\`\`\`