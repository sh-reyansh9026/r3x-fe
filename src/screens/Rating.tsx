import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { sellerReview } from "../constants/constant";
import { Image } from "react-native";
import { platformReview } from "../constants/constant";
import CustomText from '../components/CustomText';
const TABS = [
  { label: "Rate a Seller" },
  { label: "Rate the Platform" },
];

const Rating = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#001133" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Ratings & Reviews</CustomText>
      </View>

      {/* Leave a Review Section */}
      <View style={styles.reviewSection}>
        <CustomText style={styles.sectionTitle}>Leave a Review</CustomText>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tab, activeTab === idx && styles.activeTab]}
              onPress={() => setActiveTab(idx)}
            >
              <CustomText style={[styles.tabText, activeTab === idx && styles.activeTabText]}>{tab.label}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
        {/* Rating Stars */}
        <CustomText style={styles.ratingLabel}>{activeTab === 0 ? "Seller Rating" : "Platform Rating"}</CustomText>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Icon
                name={i <= rating ? "star" : "star-outline"}
                size={32}
                color={i <= rating ? "#FFD700" : "#C0C0C0"}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        {/* Review Textarea */}
        <CustomText style={styles.reviewLabel}>{activeTab === 0 ? "Seller Review" : "Platform Review"}</CustomText>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder={`Share details about your experience with this ${activeTab === 0 ? "seller" : "platform"}`}
          value={review}
          placeholderTextColor="gray"
          onChangeText={setReview}
        />
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn}>
          <CustomText style={styles.submitBtnText}>Submit Review</CustomText>
        </TouchableOpacity>
      </View>
      {/* All Reviews Section (Optional) */}
      <View>
      <CustomText style={styles.reviewsTitle}>{activeTab === 0 ? "Seller Reviews" : "Platform Reviews"}</CustomText>

      {/* You can map and render reviews here */}
      {(activeTab === 0 ? sellerReview : platformReview).map((reviews, index) => (
  <View key={index} style={styles.reviewCard}>
    <Image source={{ uri: reviews.profile }} style={styles.reviewCardIcon} />
    <View style={{ flex: 1 }}>
      <CustomText style={styles.reviewCardName}>{reviews.name}</CustomText>

      <View style={styles.starsRow}>
        {Array.from({ length: reviews.rating }, (_, i) => (
          <Image
            key={i}
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/1828/1828884.png" }}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
        ))}
      </View>

      <CustomText style={styles.reviewCardReview}>{reviews.review}</CustomText>
    </View>
  </View>
))}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001133",
  },
  reviewSection: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#001133",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#f4f7fa",
    borderRadius: 6,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    zIndex: 1,
  },
  tabText: {
    color: "#6c7a89",
    fontWeight: "600",
    fontSize: 16,
  },
  activeTabText: {
    color: "#001133",
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 6,
    marginBottom: 4,
    color: "#001133",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  star: {
    marginHorizontal: 2,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#001133",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 16,
    backgroundColor: "#fafbfc",
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#001133",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b133c",
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  reviewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 32,
    marginTop: -12
  },
  reviewCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  reviewCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001133",
  },
  reviewCardRating: {
    fontSize: 8,
    color: "#6c7a89",
  },
  reviewCardReview: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Rating;