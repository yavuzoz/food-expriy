import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { fetchProducts, deleteOneProduct } from "../api";
import { Card, Title, Paragraph, Button } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';

const Products = () => {
    const [data, setData] = useState([])
    const today = new Date();

    const fetchAllProducts = async () => {
        try {
            const fetchedData = await fetchProducts();
            setData(fetchedData)
            

        } catch(error) {
            console.log(error)
        }
    }
    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
        return date.toDateString(); // Convert Date object to a readable date string
    };

    const deleteProduct = async (id) => {
        try {
            const response = await deleteOneProduct(id);
            if (response) {
                fetchAllProducts();
            }
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, [data])

    return (
        <>
        {data.length > 0 ? 
        <ScrollView>
            {data.map((doc) => (
                <Card key={doc.id} style={{ margin: 10 }}>
                    <Card.Content style={styles.cardContainer}>
                        <View>
                            <Title>Product Name: {doc.product_name}</Title>
                            <Paragraph>Expiry Date: {formatTimestamp(doc.expiry_date)}</Paragraph>
                            <Paragraph>Barcode: {doc.barcode}</Paragraph>
                            <Paragraph>Status: {today >= doc.expiry_date.toDate() ? <Paragraph style={{color: 'red'}}>Expired</Paragraph> : <Paragraph style={{color: 'green'}}>Good</Paragraph>}</Paragraph>
                        </View>
                        <View style={styles.deleteButton}>
                            <TouchableOpacity
                                onPress={() => (deleteProduct(doc.id))}
                            >
                                <AntDesign name="delete" size={32} color="black" />
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView> : 
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontSize:24}}>No Products Found!</Text>
        </View>
        }
        </>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deleteButton: {
        justifyContent: "center"
    }
})

export default Products;