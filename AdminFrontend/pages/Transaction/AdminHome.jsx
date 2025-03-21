import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import axios from 'axios';
import MoneyRequestCard from '../components/MoneyRequestCard';
import Withdraw from '../components/Withdraw';
import {baseUrl} from '../../env';

const AdminHome = () => {
  const [toggle, setToggle] = useState('moneyRequest');
  const [item, setItem] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending'); // Default filter is 'pending'
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-render
  const admin = 'Arjun';

  // Convert to useCallback to prevent unnecessary recreations
  const fetchMoneyRequests = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/khelmela/admin/money/getMoneyRequest`,
      );
      setItem(response.data);
    } catch (error) {
      console.log('Error fetching money requests:', error);
    }
  }, []);

  // Fetch data when toggle changes or when refreshKey changes
  useEffect(() => {
    if (toggle === 'moneyRequest') {
      fetchMoneyRequests();
    }
  }, [toggle, refreshKey, fetchMoneyRequests]);

  // Function to trigger re-render from child components
  const handleRequestUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Function to filter items based on status
  const getFilteredItems = () => {
    if (statusFilter === 'pending') {
      return item.filter(
        request =>
          request.status !== 'approved' && request.status !== 'rejected',
      );
    } else if (statusFilter === 'approved') {
      return item.filter(request => request.status === 'approved');
    } else if (statusFilter === 'rejected') {
      return item.filter(request => request.status === 'rejected');
    } else {
      return item; // 'all' or any other case
    }
  };

  // Function to handle rendering components
  const handleRender = () => {
    if (toggle === 'moneyRequest') {
      const filteredItems = getFilteredItems();

      return (
        <>
          {/* Status Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={
                statusFilter === 'pending'
                  ? styles.activeFilterButton
                  : styles.filterButton
              }
              onPress={() => setStatusFilter('pending')}>
              <Text
                style={
                  statusFilter === 'pending'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                Pending ‼️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                statusFilter === 'approved'
                  ? styles.activeFilterButton
                  : styles.filterButton
              }
              onPress={() => setStatusFilter('approved')}>
              <Text
                style={
                  statusFilter === 'approved'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                Approved ✅
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                statusFilter === 'rejected'
                  ? styles.activeFilterButton
                  : styles.filterButton
              }
              onPress={() => setStatusFilter('rejected')}>
              <Text
                style={
                  statusFilter === 'rejected'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                Rejected ❌
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                statusFilter === 'all'
                  ? styles.activeFilterButton
                  : styles.filterButton
              }
              onPress={() => setStatusFilter('all')}>
              <Text
                style={
                  statusFilter === 'all'
                    ? styles.activeFilterText
                    : styles.filterText
                }>
                All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchMoneyRequests}>
            <Text style={styles.refreshText}>↻ Refresh</Text>
          </TouchableOpacity>

          {/* Filter Summary */}
          <Text style={styles.filterSummary}>
            Showing {filteredItems.length}{' '}
            {statusFilter !== 'all' ? statusFilter : ''} deposit requests
          </Text>

          <ScrollView>
            {filteredItems.length > 0 ? (
              filteredItems.map((request, index) => (
                <MoneyRequestCard
                  key={index}
                  id={request._id}
                  username={request.username}
                  amount={request.amount}
                  remark={request.remark}
                  selectedMethod={request.selectedMethod}
                  image={request.image}
                  date={request.date}
                  status={request.status}
                  esewaNumber={request.esewaNumber}
                  senderId={request.senderId}
                  statusmessage={request.message}
                  onRequestUpdate={handleRequestUpdate} // Pass down callback for re-rendering
                  handleRefresh={fetchMoneyRequests}
                />
              ))
            ) : (
              <View style={styles.noRequestsContainer}>
                <Text style={styles.noRequestsText}>
                  No {statusFilter} deposit requests found
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      );
    } else if (toggle === 'withDraw') {
      return <Withdraw />; // Pass callback to Withdraw component
    } else {
      return <Text>No content</Text>;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.adminText}>Admin: {admin}</Text>
        {/* Toggle Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              toggle === 'moneyRequest' ? styles.activeButton : styles.Button
            }
            onPress={() => setToggle('moneyRequest')}>
            <Text style={styles.toggleButtonText}>Deposit Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={toggle === 'withDraw' ? styles.activeButton : styles.Button}
            onPress={() => setToggle('withDraw')}>
            <Text style={styles.toggleButtonText}>Withdraw Requests</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render the selected component */}
      <View style={styles.contentContainer}>{handleRender()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  Button: {
    backgroundColor: 'skyblue',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  toggleButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  adminText: {
    backgroundColor: 'lightgreen',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 2,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 2,
  },
  filterText: {
    color: '#333',
    fontSize: 12,
  },
  activeFilterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterSummary: {
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  noRequestsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
    height: 100,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#888',
  },
});

export default AdminHome;
