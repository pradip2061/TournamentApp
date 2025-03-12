import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {baseUrl, IP, SERVER_PORT} from '../env';
import axios from 'axios';
import MoneyRequestCard from './components/MoneyRequestCard';

const Withdraw = () => {
  return (
    <>
      <Text> Withdraw Requests </Text>
    </>
  );
};

const AdminHome = () => {
  const [toggle, setToggle] = useState('moneyRequest');
  const [item, setItem] = useState([
    {gameName: 'raiden', amount: 100, remark: 'test'},
  ]);
  const [statusFilter, setStatusFilter] = useState('pending'); // Default filter is 'pending'
  const admin = 'Arjun';

  useEffect(() => {
    console.log(`${baseUrl}khelmela/admin/money/getMoneyRequest`);

    const getData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/khelmela/admin/money/getMoneyRequest`,
        );
        setItem(response.data);
        console.log(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        console.log('finally');
      }
    };
    getData();
  }, [toggle]);

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
    const handleDropRelease = id => {};
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

          {/* Filter Summary */}
          <Text style={styles.filterSummary}>
            Showing {filteredItems.length}{' '}
            {statusFilter !== 'all' ? statusFilter : ''} requests
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
                  onPress={() => handleDropRelease(request)}
                />
              ))
            ) : (
              <View style={styles.noRequestsContainer}>
                <Text style={styles.noRequestsText}>
                  No {statusFilter} requests found
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      );
    } else if (toggle === 'withDraw') {
      return <Withdraw />;
    } else {
      return <Text>No content</Text>;
    }
  };

  return (
    <>
      <View style={{}}>
        <Text style={styles.adminText}>Admin: {admin}</Text>
        {/* Toggle Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              toggle === 'moneyRequest' ? styles.activeButton : styles.Button
            }
            onPress={() => setToggle('moneyRequest')}>
            <Text> Add Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={toggle === 'withDraw' ? styles.activeButton : styles.Button}
            onPress={() => setToggle('withDraw')}>
            <Text>Withdraw Request </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render the selected component */}
      {handleRender()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#011638',
  },
  Button: {
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'orange',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  adminText: {
    backgroundColor: 'lightgreen',
    fontWeight: 'bold',
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
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
