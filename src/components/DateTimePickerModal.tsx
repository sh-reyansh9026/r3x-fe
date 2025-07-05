import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomText from './CustomText';
interface DateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({ visible, onClose, onConfirm }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(true);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    if (mode === 'date') {
      setMode('time');
    } else {
      setShowPicker(false);
      onConfirm(selectedDate || date);
      onClose();
    }
  };

  React.useEffect(() => {
    if (visible) {
      setMode('date');
      setShowPicker(true);
      setDate(new Date());
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <CustomText style={styles.title}>{mode === 'date' ? 'Pick a date' : 'Pick a time'}</CustomText>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode={mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleChange}
            />
          )}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <CustomText style={styles.cancelText}>Cancel</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default DateTimePickerModal;
