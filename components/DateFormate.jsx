import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { StyleSheet, Text } from 'react-native';

export default function PostTime({ timestamp }) {
  const date = new Date(timestamp);

  let displayText = '';

  if (isToday(date)) {
    displayText = format(date, 'p'); // ex: 2:39 AM
  } else if (isYesterday(date)) {
    displayText = 'Yesterday';
  } else if (formatDistanceToNow(date, { addSuffix: true }).includes('day')) {
    displayText = format(date, 'MMM d'); // ex: Apr 23
  } else {
    displayText = formatDistanceToNow(date, { addSuffix: true }); // ex: 20 minutes ago
  }

  return <Text style={styles.timeText}>{displayText}</Text>;
}

const styles = StyleSheet.create({
  timeText: {
    fontSize: 14,
    color: '#666',
    // add more styles as needed
  },
});