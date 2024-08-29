import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Text, View, StyleSheet, Button, Modal, Animated, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addProduct, fetchProductName } from '../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Barcode = ({navigation}) => {
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [productName,setProductName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [expiryDate, setExpiryDate] = useState();
    const [showModal, setShowModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const bottomSheetModalRef = useRef(null);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
       
    };
    const showDatepicker = () => {
        showMode('date');
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const handleBarcodeChange = (text) => {
        setBarcode(text);
    };
    
    const handleProductNameChange = (text) => {
        setProductName(text);
    };
    
    const handleExpiryDateChange = (text) => {
        setExpiryDate(date.toISOString().split('T')[0]);

    };

    const handleSubmit = () => {
        // Perform actions with barcode, product name, and expiry date
        // Add logic here to save or process the entered data
        addProductDetails();
        setShowModal(false);
    };

    // variables
    const snapPoints = useMemo(() => ['25%', '50%'], []);
  
    // callbacks
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);

    const addProductDetails = async () => {
        const fetchedData = await addProduct(barcode, productName, date);
    }

    const fetchName = async (barcode) => {
        const name = await fetchProductName(barcode)
        setProductName(name)
        setBarcode(barcode)
        handlePresentModalPress();
    }
    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
    };

    useEffect(() => {
        getBarCodeScannerPermissions();
        setScanned(false);
        setScanning(false)
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        fetchName(data);
        setShowModal(true);
        setScanned(true);
    
    };

    const scanAgain = () => {
        setScanned(false);
        setShowModal(false);
        setScanning((prevState) => !prevState);
    }
  

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <GestureHandlerRootView style={{flex:1}}>
            <View style={styles.container}>
                {scanning && (
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}
                
                {showModal && (
                    <BottomSheetModalProvider>
                        <View style={styles.container}>
                            <BottomSheetModal
                                ref={bottomSheetModalRef}
                                index={1}
                                snapPoints={snapPoints}
                                onChange={handleSheetChanges}
                            >
                                
                                <View style={styles.contentContainer}>
                                    <Text style={styles.heading}>Details</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Barcode</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleBarcodeChange}
                                            value={barcode}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Product Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleProductNameChange}
                                            value={productName}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Expiry Date</Text>
                                        <View style={styles.expiryInputContainer}>
                                            <TextInput
                                                style={styles.expiryInput}
                                                onChangeText={handleExpiryDateChange}
                                                value={date.toISOString().split('T')[0]}
                                            />
                                            <Button
                                                onPress={showDatepicker}
                                                title="Set Expiry Date"
                                                color="black"
                                            />
                                        </View>
                                    </View>
                                    <Button title="Save" onPress={handleSubmit}/>
                                    
                                    {show && (
                                        <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        onChange={onChange}
                                        />
                                    )}
                        
                                </View>
                            </BottomSheetModal>
                        </View>
                    </BottomSheetModalProvider>
                )}
                
                <Button title={'Tap to Scan'} onPress={scanAgain} />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
      },
      expiryInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
      },
      expiryInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
      },
      inputContainer: {
        width: '100%',
        marginBottom: 20,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },

      submitButton: {
        width: 100, // Adjust the width as needed (percentage or fixed value)
        marginTop: 20,
      },
});

export default Barcode;