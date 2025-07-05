// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import CustomText from '../components/CustomText';

// // Simulate buyer, seller, and item info for demo
// const mockBuyer = { id: 'buyer1', name: 'Buyer' };
// const mockSeller = { id: 'seller1', name: 'Seller' };
// const mockItem = { id: 'item1', name: 'Sample Item', price: '₹100', location: 'Delhi', description: 'A great item', image: { uri: '' } };

// type NotificationType = 'none' | 'request' | 'available' | 'not_available';

// type NotificationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notification'>;

// import { RouteProp, useRoute } from '@react-navigation/native';

// type NotificationScreenRouteProp = RouteProp<RootStackParamList, 'Notification'>;

// const Notification = () => {
//   const navigation = useNavigation<NotificationNavigationProp>();
//   const route = useRoute<NotificationScreenRouteProp>();
//   const { isBuyMode } = route.params;
//   const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

//   // Shared notification state
//   const [notifState, setNotifState] = useState<{
//     message: NotificationType;
//     from: 'buyer' | 'seller' | null;
//     to: 'buyer' | 'seller' | null;
//   }>({ message: 'none', from: null, to: null });

//   // Buyer sends notification to seller
//   const handleSendRequest = () => {
//     setNotifState({ message: 'request', from: 'buyer', to: 'seller' });
//   };

//   // Seller responds to notification
//   const handleSellerResponse = (available: boolean) => {
//     setNotifState({
//       message: available ? 'available' : 'not_available',
//       from: 'seller',
//       to: 'buyer',
//     });
//     // If available, open chat for seller as well
//     if (available) {
//       setTimeout(() => {
//         navigation.navigate('Chat', {
//           item: mockItem,
//           buyer: mockBuyer,
//           seller: mockSeller,
//         });
//       }, 500);
//     }
//   };

//   // Buyer acknowledges availability and opens chat
//   const handleBuyerOk = () => {
//     setNotifState({ message: 'none', from: null, to: null });
//     navigation.navigate('Chat', {
//       item: mockItem,
//       buyer: mockBuyer,
//       seller: mockSeller,
//     });
//   };

//   // Utility for switching roles (demo only)
//   const toggleRole = () => {
//     setRole(role === 'buyer' ? 'seller' : 'buyer');
// };

// //   // UI rendering
// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.roleRow}>
// //         <CustomText style={styles.roleText}>Role: </CustomText>
// //         <TouchableOpacity style={[styles.roleBtn, role === 'buyer' && styles.activeRoleBtn]} onPress={() => setRole('buyer')}>
// //           <CustomText style={[styles.roleBtnText, role === 'buyer' && styles.activeRoleBtnText]}>Buyer</CustomText>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={[styles.roleBtn, role === 'seller' && styles.activeRoleBtn]} onPress={() => setRole('seller')}>
// //           <CustomText style={[styles.roleBtnText, role === 'seller' && styles.activeRoleBtnText]}>Seller</CustomText>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Notification UI */}
// //       <View style={styles.notificationBox}>
// //         {/* Buyer View */}
// //         {role === 'buyer' && (
// //           <>
// //             {notifState.message === 'none' && (
// //               <>
// //                 <CustomText style={styles.infoText}>No notifications yet.</CustomText>
// //                 <TouchableOpacity style={styles.actionBtn} onPress={handleSendRequest}>
// //                   <CustomText style={styles.actionBtnText}>Send Notification to Seller</CustomText>
// //                 </TouchableOpacity>
// //               </>
// //             )}
// //             {notifState.message === 'available' && notifState.to === 'buyer' && (
// //               <>
// //                 <CustomText style={styles.infoText}>Seller: Item is Available!</CustomText>
// //                 <TouchableOpacity style={styles.actionBtn} onPress={handleBuyerOk}>
// //                   <CustomText style={styles.actionBtnText}>OK</CustomText>
// //                 </TouchableOpacity>
// //               </>
// //             )}
// //             {notifState.message === 'not_available' && notifState.to === 'buyer' && (
// //               <CustomText style={styles.infoText}>Seller: Sorry, item is not available.</CustomText>
// //             )}
// //           </>
// //         )}
// //         {/* Seller View */}
// //         {role === 'seller' && (
// //           <>
// //             {notifState.message === 'request' && notifState.to === 'seller' && (
// //               <>
// //                 <CustomText style={styles.infoText}>Buyer wants to know if the item is available.</CustomText>
// //                 <View style={styles.btnRow}>
// //                   <TouchableOpacity style={[styles.actionBtn, styles.availableBtn]} onPress={() => handleSellerResponse(true)}>
// //                     <CustomText style={styles.actionBtnText}>Available</CustomText>
// //                   </TouchableOpacity>
// //                   <TouchableOpacity style={[styles.actionBtn, styles.notAvailableBtn]} onPress={() => handleSellerResponse(false)}>
// //                     <CustomText style={styles.actionBtnText}>Not Available</CustomText>
// //                   </TouchableOpacity>
// //                 </View>
// //               </>
// //             )}
// //             {notifState.message === 'none' && <CustomText style={styles.infoText}>No notifications yet.</CustomText>}
// //             {notifState.message === 'available' && notifState.from === 'seller' && (
// //               <CustomText style={styles.infoText}>You told buyer item is available.</CustomText>
// //             )}
// //             {notifState.message === 'not_available' && notifState.from === 'seller' && (
// //               <CustomText style={styles.infoText}>You told buyer item is not available.</CustomText>
// //             )}
// //           </>
// //         )}
// //       </View>
// //       <TouchableOpacity style={styles.toggleRoleBtn} onPress={toggleRole}>
// //         <CustomText style={styles.toggleRoleBtnText}>Switch to {role === 'buyer' ? 'Seller' : 'Buyer'} View</CustomText>

//   return (
//     <View style={styles.container}>
//       <View style={styles.roleRow}>
//         <CustomText style={styles.roleText}>Role: </CustomText>
//         <TouchableOpacity style={[styles.roleBtn, role === 'buyer' && styles.activeRoleBtn]} onPress={() => setRole('buyer')}>
//           <CustomText style={[styles.roleBtnText, role === 'buyer' && styles.activeRoleBtnText]}>Buyer</CustomText>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.roleBtn, role === 'seller' && styles.activeRoleBtn]} onPress={() => setRole('seller')}>
//           <CustomText style={[styles.roleBtnText, role === 'seller' && styles.activeRoleBtnText]}>Seller</CustomText>
//         </TouchableOpacity>
//       </View>

//       {/* Notification UI */}
//       {isBuyMode ? (
//         <View style={styles.notificationBox}>
//           {role === 'buyer' && notifState.message === 'none' && (
//             <>
//               <CustomText style={styles.infoText}>No notifications yet.</CustomText>
//               <TouchableOpacity style={styles.actionBtn} onPress={handleSendRequest}>
//                 <CustomText style={styles.actionBtnText}>Send Notification to Seller</CustomText>
//               </TouchableOpacity>
//             </>
//           )}

//           {role === 'seller' && notifState.message === 'request' && (
//             <>
//               <CustomText style={styles.infoText}>Buyer wants to know if the item is available.</CustomText>
//               <View style={styles.btnRow}>
//                 <TouchableOpacity style={[styles.actionBtn, styles.availableBtn]} onPress={() => handleSellerResponse(true)}>
//                   <CustomText style={styles.actionBtnText}>Available</CustomText>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.actionBtn, styles.notAvailableBtn]} onPress={() => handleSellerResponse(false)}>
//                   <CustomText style={styles.actionBtnText}>Not Available</CustomText>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}

//           {role === 'buyer' && notifState.message === 'request' && (
//             <CustomText style={styles.infoText}>Buyer wants to know if the item is available.</CustomText>
//           )}

//           {role === 'buyer' && notifState.message === 'available' && (
//             <>
//               <CustomText style={styles.infoText}>Seller: Item is Available!</CustomText>
//               <TouchableOpacity style={styles.actionBtn} onPress={handleBuyerOk}>
//                 <CustomText style={styles.actionBtnText}>OK</CustomText>
//               </TouchableOpacity>
//             </>
//           )}

//           {role === 'buyer' && notifState.message === 'not_available' && (
//             <CustomText style={styles.infoText}>Seller: Sorry, item is not available.</CustomText>
//           )}

//           {role === 'seller' && notifState.message === 'none' && (
//             <CustomText style={styles.infoText}>No notifications yet.</CustomText>
//           )}


//         {role === 'seller' && notifState.message === 'available' && (
//           <CustomText style={styles.infoText}>You told buyer item is available.</CustomText>
//         )}
//         {role === 'seller' && notifState.message === 'not_available' && (
//           <CustomText style={styles.infoText}>You told buyer item is not available.</CustomText>
//         )}
//       </View>
//       ) : ( 
//       <TouchableOpacity style={styles.toggleRoleBtn} onPress={toggleRole}>
//         <CustomText style={styles.toggleRoleBtnText}>Switch to {role === 'buyer' ? 'Seller' : 'Buyer'} View</CustomText>
//       </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#f4f6fb',
//     justifyContent: 'center',
//   },
//   roleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//     justifyContent: 'center',
//   },
//   roleText: {
//     fontSize: 18,
//     marginRight: 8,
//     fontWeight: '600',
//   },
//   roleBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginHorizontal: 6,
//     backgroundColor: '#e0e0e0',
//   },
//   activeRoleBtn: {
//     backgroundColor: '#1e90ff',
//   },
//   roleBtnText: {
//     color: '#222',
//     fontWeight: '500',
//   },
//   activeRoleBtnText: {
//     color: '#fff',
//   },
//   notificationBox: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 3,
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   infoText: {
//     fontSize: 16,
//     marginBottom: 18,
//     textAlign: 'center',
//   },
//   actionBtn: {
//     backgroundColor: '#1e90ff',
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 6,
//     marginHorizontal: 6,
//   },
//   availableBtn: {
//     backgroundColor: '#2ecc40',
//   },
//   notAvailableBtn: {
//     backgroundColor: '#ff4136',
//   },
//   actionBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   btnRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   toggleRoleBtn: {
//     alignSelf: 'center',
//     marginTop: 12,
//     padding: 10,
//     backgroundColor: '#aaa',
//     borderRadius: 8,
//   },
//   toggleRoleBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// export default Notification;

import React from 'react'
import CustomText from '../components/CustomText'
import { View } from 'react-native'

const Notification = () => {
  return (
    <View>
      <CustomText>Notification</CustomText>
      </View>
  )
}

export default Notification