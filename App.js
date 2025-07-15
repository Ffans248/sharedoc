import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const defaultData = {
  receiptNumber: "WALLET789012",
  clientName: "Juan Carlos Pérez",
  total: "750.50",
  date: new Date().toLocaleDateString(),
  cuota: "22",
  capital: "625.00",
  interes: "100.50",
  mora: "15.00",
  otros: "10.00"
};

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const generarHTML = () => {
    return `
      <html>
      <head>
      <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h1 { color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          p { font-size: 16px; margin: 6px 0; }
          .label { font-weight: bold; }
        </style>
       </head>
        <body>
          <h1>Resumen de Pago</h1>
          <p><strong>Recibo:</strong> ${defaultData.receiptNumber}</p>
          <p><strong>Cliente:</strong> ${defaultData.clientName}</p>
          <p><strong>Fecha:</strong> ${defaultData.date}</p>
          <p><strong>Total:</strong> Q${defaultData.total}</p>
          <p><strong>Cuota:</strong> ${defaultData.cuota}</p>
          <p><strong>Capital:</strong> Q${defaultData.capital}</p>
          <p><strong>Interés:</strong> Q${defaultData.interes}</p>
          <p><strong>Mora:</strong> Q${defaultData.mora}</p>
          <p><strong>Otros:</strong> Q${defaultData.otros}</p>
        </body>
      </html>
    `;
  };

  const imprimir = async () => {
    try {
      await Print.printAsync({ html: generarHTML() });
    } catch (error) {
      Alert.alert("Error al imprimir", error.message);
    }
  };

  const guardarPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generarHTML() });
      const pdfPath = FileSystem.documentDirectory + 'resumen_pago.pdf';
      await FileSystem.moveAsync({
        from: uri,
        to: pdfPath
      });
      Alert.alert("PDF guardado", "Se ha guardado en: " + pdfPath);
    } catch (error) {
      Alert.alert("Error al guardar PDF", error.message);
    }
  };

  const compartirPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generarHTML() });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error al compartir", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Mostrar Resumen de Pago" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Resumen de Pago</Text>
            <Text>Recibo: {defaultData.receiptNumber}</Text>
            <Text>Cliente: {defaultData.clientName}</Text>
            <Text>Fecha: {defaultData.date}</Text>
            <Text>Total: Q{defaultData.total}</Text>
            <Text>Cuota: {defaultData.cuota}</Text>
            <Text>Capital: Q{defaultData.capital}</Text>
            <Text>Interés: Q{defaultData.interes}</Text>
            <Text>Mora: Q{defaultData.mora}</Text>
            <Text>Otros: Q{defaultData.otros}</Text>

            <View style={styles.buttonGroup}>
              <Button title="Imprimir" onPress={imprimir} />
              <Button title="Guardar PDF" onPress={guardarPDF} />
              <Button title="Compartir" onPress={compartirPDF} />
              <Button title="Cerrar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10
  }
});
