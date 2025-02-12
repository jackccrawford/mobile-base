import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { PatternProps } from '../core/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../components/Toast/ToastProvider';

interface TestPatternProps extends PatternProps {
  onTest?: () => void;
}

export const TestPatternScreen: React.FC<TestPatternProps> = ({
  onTest,
  isDisabled,
  testId,
}) => {
  const [count, setCount] = React.useState(0);
  const { showToast } = useToast();

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    showToast({
      message: `Count increased to ${newCount}!`,
      type: 'success'
    });
  };

  const handleTest = () => {
    showToast({
      message: 'Running test...',
      type: 'info'
    });
    onTest?.();
  };

  return (
    <SafeAreaView style={styles.container} testID={testId}>
      <View style={styles.content}>
        <Text style={styles.title}>Mobile Base</Text>
        <Text style={styles.subtitle}>Test Pattern</Text>
        
        <View style={styles.patternDemo}>
          <Text style={styles.counter}>{count}</Text>
          <Button 
            label="Increment"
            onPress={handleIncrement}
            disabled={isDisabled}
          />
        </View>

        {onTest && (
          <Button 
            label="Run Test"
            onPress={handleTest}
            variant="secondary"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  patternDemo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
