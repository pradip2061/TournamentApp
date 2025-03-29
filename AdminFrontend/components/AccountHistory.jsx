import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AccountHistoryModal = ({visible, onClose, user}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const accountHistory = user.accountHistory;

  if (!accountHistory) {
    return null;
  }

  const sortedHistory = [...accountHistory].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);

    // Sort in descending order (most recent first)
    return dateA - dateB;
  });

  // Group transactions by type using the sorted history
  const withdrawals = sortedHistory.filter(
    item =>
      (item.statusmessage && item.statusmessage.includes('Withdraw')) ||
      (item.message && item.message.includes('Withdrawal')),
  );
  const deposits = sortedHistory.filter(
    item =>
      (item.statusmessage && item.statusmessage.includes('Deposite')) ||
      (item.message && item.message.includes('Deposite')),
  );
  const others = sortedHistory.filter(
    item => !withdrawals.includes(item) && !deposits.includes(item),
  );

  // Determine which data to display based on active tab
  const getActiveData = () => {
    switch (activeTab) {
      case 'withdrawals':
        return withdrawals;
      case 'deposits':
        return deposits;
      case 'others':
        return others;
      default:
        return sortedHistory;
    }
  };

  const openImagePreview = imageUrl => {
    setSelectedImage(imageUrl);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const renderImage = imageUrl => {
    if (!imageUrl) return null;

    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => openImagePreview(imageUrl)}>
        <Image
          source={{uri: imageUrl}}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    );
  };

  const renderTableRow = (item, index) => {
    return (
      <View
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.evenRow : styles.oddRow,
        ]}
        key={index}>
        {/* Admin Field */}
        <Text style={styles.adminCell}>{item.admin || 'System'}</Text>

        {/* Vertical Line */}
        <View style={styles.verticalLine} />

        {/* Message Field */}
        <View style={styles.messageCell}>
          <Text style={styles.messageText}>
            {item.message || item.statusmessage || 'N/A'}
          </Text>
          {item.reason && (
            <Text style={styles.reasonText}>Reason: {item.reason}</Text>
          )}
          {item.date && <Text style={styles.dateText}>{item.date}</Text>}
        </View>

        {/* Vertical Line */}
        <View style={styles.verticalLine} />

        {/* Image Field */}
        <View style={styles.imageCell}>{renderImage(item.image)}</View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Account History</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'all' && styles.activeTabText,
                ]}>
                All ({sortedHistory.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'withdrawals' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('withdrawals')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'withdrawals' && styles.activeTabText,
                ]}>
                Withdrawals ({withdrawals.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'deposits' && styles.activeTab]}
              onPress={() => setActiveTab('deposits')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'deposits' && styles.activeTabText,
                ]}>
                Deposits ({deposits.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'others' && styles.activeTab]}
              onPress={() => setActiveTab('others')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'others' && styles.activeTabText,
                ]}>
                Others ({others.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalHeader}>
            {/* Image displayed at the top */}
            <Image style={styles.roundImage} source={{uri: user.image}} />

            <View style={styles.tableHeader}>
              <Text style={styles.adminHeader}>Admin</Text>
              <View style={styles.headerVerticalLine} />
              <Text style={styles.messageHeader}>Details</Text>
              <View style={styles.headerVerticalLine} />
              <Text style={styles.imageHeader}>Image</Text>
            </View>
          </View>

          <ScrollView style={styles.tableContainer}>
            {getActiveData().length > 0 ? (
              getActiveData().map((item, index) => renderTableRow(item, index))
            ) : (
              <Text style={styles.noDataText}>No transactions found</Text>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Image Preview Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedImage !== null}
        onRequestClose={closeImagePreview}>
        <View style={styles.imagePreviewContainer}>
          <TouchableOpacity
            style={styles.imagePreviewCloseButton}
            onPress={closeImagePreview}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{uri: selectedImage}}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  adminHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  messageHeader: {
    flex: 4,
    fontWeight: 'bold',
  },
  imageHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerVerticalLine: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  adminCell: {
    flex: 1,
    color: '#333',
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  messageCell: {
    flex: 4,
    paddingRight: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  imageCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  viewText: {
    fontSize: 10,
    color: '#2196F3',
    marginTop: 2,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  // Image Preview Modal Styles
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
  },
  imagePreviewCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});

export default AccountHistoryModal;
