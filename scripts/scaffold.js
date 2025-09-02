#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Component template
const componentTemplate = (name, isScreen = false) => `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
${isScreen ? `import { SafeAreaView } from 'react-native-safe-area-context';` : ''}
import { useTheme } from '@/src/hooks/useTheme';

interface ${name}Props {
  // Add props here
}

export const ${name}: React.FC<${name}Props> = ({
  // props
}) => {
  const { theme } = useTheme();

  return (
    ${isScreen ? '<SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>' : '<View style={styles.container}>'}
      <Text style={[styles.text, { color: theme.colors.text }]}>
        ${name} Component
      </Text>
    ${isScreen ? '</SafeAreaView>' : '</View>'}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});

export default ${name};
`;

// Hook template
const hookTemplate = (name) => `import { useState, useEffect } from 'react';

export interface Use${name}Options {
  // Add options here
}

export const use${name} = (options: Use${name}Options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hook logic here
  }, []);

  const doSomething = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Implementation here
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    doSomething,
  };
};
`;

// Utility template
const utilTemplate = (name) => `/**
 * ${name} utility functions
 */

export const ${name.toLowerCase()} = {
  // Add utility functions here
  
  format: (value: string): string => {
    return value.trim();
  },
  
  validate: (value: string): boolean => {
    return value.length > 0;
  },
};

export default ${name.toLowerCase()};
`;

function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
}

function generateComponent(name, isScreen = false) {
  const dir = isScreen ? 'src/screens' : 'src/components';
  const fileName = `${name}.tsx`;
  const filePath = path.join(process.cwd(), dir, fileName);
  
  createFile(filePath, componentTemplate(name, isScreen));
}

function generateHook(name) {
  const fileName = `use${name}.ts`;
  const filePath = path.join(process.cwd(), 'src/hooks', fileName);
  
  createFile(filePath, hookTemplate(name));
}

function generateUtil(name) {
  const fileName = `${name.toLowerCase()}.ts`;
  const filePath = path.join(process.cwd(), 'src/utils', fileName);
  
  createFile(filePath, utilTemplate(name));
}

// Main CLI logic
const command = process.argv[2];
const name = process.argv[3];

if (!command || !name) {
  console.log(`
🚀 React Native Scaffold Generator

Usage:
  node scripts/scaffold.js <command> <name>

Commands:
  component <Name>  - Generate a new component
  screen <Name>     - Generate a new screen
  hook <Name>       - Generate a new hook (use<Name>)
  util <Name>       - Generate a new utility

Examples:
  node scripts/scaffold.js component Button
  node scripts/scaffold.js screen Profile
  node scripts/scaffold.js hook LocalStorage
  node scripts/scaffold.js util ApiHelper
  `);
  process.exit(1);
}

// Ensure name is PascalCase
const pascalName = name.charAt(0).toUpperCase() + name.slice(1);

switch (command.toLowerCase()) {
  case 'component':
    generateComponent(pascalName);
    break;
  case 'screen':
    generateComponent(pascalName, true);
    break;
  case 'hook':
    generateHook(pascalName);
    break;
  case 'util':
    generateUtil(pascalName);
    break;
  default:
    console.log(`❌ Unknown command: ${command}`);
    process.exit(1);
}